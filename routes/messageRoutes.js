const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

// Handle anonymous message submission
router.post('/:username/send', async (req, res) => {
    const { username } = req.params;
    const { messageText } = req.body;

    // Create a new message
    const newMessage = new Message({
        recipientUsername: username,
        messageText: messageText,
    });

    try {
        // Save the message in the database
        await newMessage.save();
        res.redirect(`/user/${username}`);  // Redirect back to the user's NGL page
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending message' });
    }
});

// Get all messages for a user
router.get('/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const messages = await Message.find({ recipientUsername: username });
        res.json(messages);  // Sends back an array of messages
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages' });
    }
});

module.exports = router;
