const router = require('express').Router();
const {addComment, removeComment, addReply, removeReply} = require('../../controllers/comment-controller');

// /api/comments/pizzaid
router.route('/:pizzaId').post(addComment);

// /api/comments/pizzaId/commetntid
router.route('/:pizzaId/:commentId').put(addReply).delete(removeComment);
router.route('/:pizzaId/:commentId/:replyId').delete(removeReply);
//we're trying to model the routes in a RESTful manner
//a best practice we should include the ids of the parent resources in the endpoint
//like saying, "Go to this pizza, then look at this particular comment, then delete this one reply."

module.exports = router;