const router = require("express").Router();
const Thought = require("../models/thoughtModel");
const User = require("../models/userModel");


//add thought router
//api/thoughts/add
router.post("/add", async (req, res) => {
    try {
      const { thoughtText, username} = req.body;
  
      //validation
      if (!thoughtText || !username)
        return res
          .status(400)
          .json({ errorMessage: "Please enter all required fields." });
  
      
  
      const existingUser = await User.findOne({ username:username});
      if (!existingUser)

        return res.status(400).json({
          errorMessage: "User not found",
        });
  
    
      const newthought = new Thought({
        thoughtText:thoughtText,
        username: username,
        
      });
      try {
        const savedThought= await newthought.save();
        User.findOneAndUpdate(
            { username: username }, 
            { $push: { 
                      thoughts: {thoughtId:savedThought._id}
                    } 
            })
        res.status(200).json({message: 'new thought added successfully', data: savedThought});
      } catch (err) {
        res.status(500).json(err);
      }
    } catch (err) {
      console.error(err);
      //internal server error
      res.status(500).send('Something went wrong!');
    }
  });

//getall thoughts router
//api/thoughts/
router.get("/", async (req, res) => {
  
    try {
        const thoughts = await Thought.find()
        res.status(200).json(thoughts)
    } catch (err) {
      res.status(500).json(err);
    }
  });


  //get thought by id router
//api/thoughts/:id
router.get("/:id", async (req, res) => {
  
    try {
        const thought = await Thought.findById(req.params.id)
        res.status(200).json(thought)
    } catch (err) {
      res.status(500).json(err);
    }
  });


  /// delete thought by id router
/// private route
/// api/thoughts/delete/:id
router.delete("/delete/:id",
async (req, res) => {
  const thought = await Thought.deleteOne({_id:req.params.id});
  if (thought) {
    res.json({success: true, message:'thought deleted successfully'});
  } else {
    res.status(404);
    res.json("Thought not found");
  }
});

/// update thought by id router
/// private route
/// api/thoughts/update/:id
router.put("/update/:id",
async (req, res) => {
  const thought = await Thought.findOneAndUpdate({_id:req.params.id}, req.body, {new: true});
  if (thought) {
    res.json({ message:'Thought updated successfully', data: thought});
  } else {
    res.status(404);
    res.json("Thought not found");
  }
});

//add reaction router
///api/thoughts/:thoughtId/reactions`
router.post("/:thoughtId/reactions", async (req, res) => {

const reactionbody=req.body.reactionbody
    const thoughtId= req.params.thoughtId;

     //validation
     if (!reactionbody || !thoughtId || !req.body.username)
     return res
       .status(400)
       .json({ errorMessage: "Please enter all required fields." });

    if(reactionbody.length > 280){
        res.status(500).json({message:"reactionbody can not be more than 280 characters"})
        return

    }

  try {
    const reaction = await Thought.findOneAndUpdate({ _id: thoughtId }, 
        { $push: { reactions: {username:req.body.username, reactionbody:reactionbody}  }}, {new:true}
        
        );
  
res.status(200).json(reaction);
 
} catch (err) {
  res.status(500).json(err);
  }
  


});


//delete reaction router
///api/thoughts/:thoughtId/reactions/delete/:reactionId`
router.delete("/:thoughtId/reactions/delete/:reactionId", async (req, res) => {

        const thoughtId= req.params.thoughtId;
        const reactionId=req.params.reactionId;
    
      try {
        const reaction = await Thought.findOneAndUpdate({ _id: thoughtId }, 
            { $pull: { reactions : {_id : reactionId}}}, {new:true}
            
            );

res.status(200).json({message:"Reaction deleted successfully"});
     
    } catch (err) {
      res.status(500).json(err);
      }
      
    
    
    });

    module.exports = router;