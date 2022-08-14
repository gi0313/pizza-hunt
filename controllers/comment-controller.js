const {Comment, Pizza} = require('../models');

const commentController = {
    //add comment to pizza
    addComment({params, body}, res) {
        console.log(body)
        Comment.create(body)
        .then(({_id}) => {
            return Pizza.findOneAndUpdate(
                {_id: params.pizzaId},
                { $push: {comments: _id} },
//Note here that we're using the $push method to add the comment's _id to the specific pizza we want to update
                { new: true }
//because we passed the option of new: true, we're receiving back the updated pizza 
            );
        })
        .then(dbPizzaData => {
            if(!dbPizzaData) {
                res.status(404).json({message: 'No pizza found with this id!'});
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    },
    addReply({params, body}, res) {
        Comment.findOneAndUpdate(
            {_id: params.commentId},
            {$push: { replies:body }},
            {new: true, runValidators: true}
        )
        .then(dbPizzaData => {
            if(!dbPizzaData) {
                res.status(404).json({message: 'No pizza found with this id!'});
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    },
    removeReply({params, body}, res) {
        Comment.findOneAndUpdate(
            {_id: params.commentId},
            {$pull: {replies: {replyId: params.replyId}}},
            //we're using the MongoDB $pull operator to remove the specific reply from the replies array
            //where the replyId matches the value of params.replyId passed in from the route. 
            {new: true}
        )
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => res.json(err));
    },
    //First we'll delete the comment, then we'll use its _id to remove it from the pizza
    removeComment({params}, res) {
        Comment.findOneAndDelete({_id: params.commentId}) //while also returning its data
        .then(deletedComment => {
            if (!deletedComment) {
                return res.status(404).json({message: 'No comment with this id!'});
            }
            return Pizza.findOneAndUpdate( //while also returning its data
                {_id: params.pizzaId},
                {$pull: {comments: params.commentId}},
                {new: true}
            );
        })
        .then(dbPizzaData => {
            if(!dbPizzaData) {
                res.status(404).json({message: 'No pizza found with this id!'});
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    }
};

module.exports = commentController;