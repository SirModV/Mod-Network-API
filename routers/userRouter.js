const router = require("express").Router();
const User = require("../models/userModel");


//add user router
//api/users/add
router.post("/add", async (req, res) => {
  try {
    const {name, email, username} = req.body;

    //validation
    if (!email || !username)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });

    

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        message: "This email already exists.",
      });

   

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
    });
    try {
      const savedUser = await newUser.save();
      res.status(200).json(savedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  } catch (err) {
    console.error(err);
    //internal server error
    res.status(500).send('Something went wrong!');
  }
});


//getall users router
//api/users/
router.get("/", async (req, res) => {
  
  try {
      const users = await User.find()
      res.status(200).json(users)
  } catch (err) {
    res.status(500).json(err);
  }
});

//get user by id router
//api/users/:id
router.get("/:id", async (req, res) => {
  
  try {
      const user = await User.findById(req.params.id)
      res.status(200).json(user)
  } catch (err) {
    res.status(500).json(err);
  }
});

/// delete user id by router
/// private route
/// api/users/delete/:id
router.delete("/delete/:id",
async (req, res) => {
  const user = await User.deleteOne({_id:req.params.id});
  if (user) {
    res.json({success: true, message:'User deleted successfully'});
  } else {
    res.status(404);
    res.json("User not found");
  }
});


/// update user id by router
/// private route
/// api/users/update/:id
router.put("/update/:id",
async (req, res) => {
  const user = await User.findOneAndUpdate({_id:req.params.id}, req.body, {new: true});
  if (user) {
    res.json({success: true, message:'User updated successfully', user});
  } else {
    res.status(404);
    res.json("User Not Found...");
  }
});


//add friends router
//api/users/:userId/friends/:friendId
router.post("/:userId/friends/:friendId", async (req, res) => {

    const friendId= req.params.friendId;
    const userId=req.params.userId;

  const isFriend=await User.find({$and:[{_id:userId}, {friends: {$in: [friendId]}}]})


  if (!isFriend.length===0) {
     return res.status(200).json({message: 'You already added this user as friend'});
  }
  try {
      const user= await User.findOneAndUpdate(
  {
      _id: userId
  },
          [
  {
          $set: {
              friends: {
                  $cond: [
                      { $in: [friendId, '$friends'] },
                      { $setDifference: ['$friends', [friendId]] },
                      { $setUnion: ['$friends', [friendId]] }
                  ]
              }
          }
      },
      
       
      
      ],
  { new: true }
);
  
res.status(200).json(user);
 
} catch (err) {
  res.status(500).json(err);
  }
  


});

//delete friends router
//api/users/:userId/friends/:friendId
router.delete("/:userId/friends/:friendId", async (req, res) => {

  const friendId= req.params.friendId;
  const userId=req.params.userId;

const isFriend=await User.find({$and:[{_id:userId}, {friends: {$in: [friendId]}}]})


if (isFriend.length===0) {
   return res.status(200).json({message: 'This user is not in your friend list'});
}
try {
    const user= await User.findOneAndUpdate(
{
    _id: userId
},
        [

    
    {
        $set: {
            friends: {
                $cond: [
                    { $in: [friendId, '$friends'] },
                    { $setDifference: ['$friends', [friendId]] },
                    '$friends'
                ]
            }
        }
    },
     
    
    ],
{ new: true }
);

res.status(200).json(user);

} catch (err) {
res.status(500).json(err);
}



});

module.exports = router;