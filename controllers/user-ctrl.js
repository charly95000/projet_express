const User = require('../models/user')
const bcrypt = require('bcrypt');
const { restart } = require('nodemon');
const user = require('../models/user');
const jwt = require('jsonwebtoken')
const fs = require('fs')

exports.signup = (req,res) => {
    bcrypt.hash(req.body.password, 10)
    .then(
        hash =>{
            const user = new User({
                email: req.body.email,
                password: hash,
                name: req.body.name,
                age: parseInt(req.body.age),
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                username: req.body.username,
                imageUrl: `http://localhost:3000/images/${req.file.filename}`,
                friends: req.body.friends
            });
            user.save()
            .then(() => res.status(201).json({message: "Utilisateur crée !"}))
            .catch(error => res.status(500).json({error}));
        })
    .catch(error => res.status(500).json({error}));
    
}

exports.login = (req, res) =>{
    User.findOne({ email: req.body.email})
    .then(user =>{
        if(!user){
            return res.status(401).json({ message: 'Email ou mot de passe incorrect'})
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if(!valid){
                return res.status(401).json({ message: 'Email ou mot de passe incorrect'})
            }
            res.status(200).json({
                userId : user._id,
                token : jwt.sign(
                    {userId : user._id},
                    'RANDOM_TOKEN_SECRET',
                    {expiresIn: 60*5}
                )
            })
        })
        .catch(error => res.status(500).json({ error:'erreur' }))
    })
    .catch(error => res.status(500).json({ error }))  
}

exports.getAllUsers = (req,res) => {
    User.find()
    .then(users =>{
        if(!users){
            return res.status(400).json({message : "Aucun utilisateur trouvé"})
        }
        res.status(200).json(users)
    })
    .catch(error => res.status(500).json({ error }))
}

exports.getUser = (req, res) => {
    if(req.params.userId === req.body.userId){
        User.findOne({_id: req.params.userId}).populate({path:'friends',select: ['name']})
        .then(user => {
            res.status(200).json(user);
          }
        ).catch(
          error => {
            res.status(400).json({
              error: error
            });
          }
        );
    }else{
        res.status(401).json({message: "Ce n'est pas votre profil"})
    } 
  };

exports.deleteUser = (req, res) => {
    if(req.params.userId === req.body.userId){
        User.findOne({_id : req.params.userId})
        .then(user => {
            const filename = user.imageUrl.split('/images/')[1]
            User.deleteOne({_id: req.params.userId })
            .then( ()=>
            {
                if(filename !=="default"){
                    fs.unlink(`images/${filename}`,() =>{
                        res.status(200).json({message:'Utilisateur supprimé'})
                    })  
                }
            }        
            ).catch(
                error => res.status(500).json({error:"erreur 1"})
            )  
        })
        .catch(
            error => res.status(500).json({error:"erreur 2"})
        )
    }else{
        res.status(401).json({message: "Ce n'est pas votre profil"})
    } 
}

exports.addFriend=(req,res) => {
    if(req.body.userId !== req.body.friendId){
        User.findOne({_id : req.body.userId, friends :{$in: req.body.friendId}})
        .then(
            user =>{
                if(!user){
                    User.findOneAndUpdate({_id: req.body.userId}, {$push : {friends: req.body.friendId}})
                    .then(
                        ()=>
                        res.status(200).json({message :'ami(e) ajouté(e)'})
                    )
                    .catch(
                        (error) =>{
                            res.status(500).json({error : 'erreur serveur'})
                        }
                    )
                }else{
                    res.status(400).json({message : "Vous etes deja ami(e)"})
                }
            }
        ).catch(
            (err) =>{
                res.status(500).json({message : "erreur serveur"})
            }
        )
    }else{
        res.status(400).json({erreur: "Vous ne pouvez pas etre votre propre ami(e)"})
    }
}

exports.removeFriend = (req,res) =>{
    if(req.body.userId !== req.body.friendId){
        User.findOne({_id : req.body.userId, friends :{$in: req.body.friendId}})
        .then(
            user =>{
                if(user){
                    User.findOneAndUpdate({_id: req.body.userId}, {$pull : {friends: req.body.friendId}})
                    .then(
                        ()=>
                        res.status(200).json({message :'ami(e) supprimé(e)'})
                    )
                    .catch(
                        (error) =>{
                            res.status(500).json({error : 'erreur serveur'})
                        }
                    )
                }else{
                    res.status(400).json({message : "Vous n'etes pas ami(e)"})
                }
            }
        ).catch(
            (err) =>{
                res.status(500).json({message : "erreur serveur"})
            }
        )
    }else{
        res.status(400).json({erreur: "Vous ne pouvez pas etre votre propre ami(e)"})
    }
}

exports.updateUser = (req, res) => {
    const update = {
        email: req.body.email,
        name: req.body.name,
        age: parseInt(req.body.age),
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
    }
    User.findOneAndUpdate({_id : req.body.userId},update)
    .then (
        () =>{
        res.status(200).json({message: "informations mises à jour"})
        }
    ).catch(
        (err) =>{
            res.status(500).json({message : "erreur serveur"})
        }
    )
}