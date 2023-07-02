const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const sequenceGenerator = require('./sequenceGenerator');
const Message = require('../models/message');

/* List messages */
router.get('/', (req, res, next) => {
  Message.find()
    .populate('sender')
    .then(messages => {
      res.status(200).json({
        message: 'Messages fetched successfully',
        data: messages
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

/* Create new message */
router.post('/', (req, res, next) => {
  const maxMessageId = sequenceGenerator.nextId('messages');

  const message = new Message({
    id: maxMessageId.toString(),
    subject: req.body.subject,
    msgText: req.body.msgText,
    // sender: mongoose.Types.ObjectId(req.body.sender)
  });

  message.save()
    .then(createdMessage => {
      res.status(201).json({
        message: 'Message added successfully',
        data: createdMessage
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

/* Get message by id */
router.get('/:id', (req, res, next) => {
  const messageId = req.params.id;

  Message.findOne({ id: messageId })
    .populate('sender')
    .then(message => {
      res.status(200).json({
        message: 'Message fetched successfully',
        data: message
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

/* Update message by id */
router.put('/:id', (req, res, next) => {
  const messageId = req.params.id;

  Message.findOneAndUpdate(
    { id: messageId },
    {
      $set: {
        name: req.body.name,
        subject: req.body.subject,
        msgText: req.body.msgText,
        // sender: mongoose.Types.ObjectId(req.body.sender)
      }
    }
  )
  .populate('sender')
  .then(updatedMessage => {
    res.status(204).json({
      message: 'Message updated successfully',
      data: updatedMessage
    });
  })
  .catch(error => {
    res.status(500).json({
      message: 'An error occurred',
      error: error
    });
  });
});

/* Delete message by id */
router.delete('/:id', (req, res, next) => {
  const messageId = req.params.id;

  Message.findOneAndDelete({ id: messageId })
    .then(() => {
      res.status(204).json({
        message: 'Message deleted successfully'
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

module.exports = router;
