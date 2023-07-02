const express = require('express');
const router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Contact = require('../models/contact');

/* List contacts */
router.get('/', (req, res, next) => {
  Contact.find()
    .populate('group')
    .then(contacts => {
      res.status(200).json({
        message: 'Contacts fetched successfully',
        contacts: contacts
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

/* Create new contact */
router.post('/', (req, res, next) => {
  const maxContactId = sequenceGenerator.nextId('contacts');

  const contact = new Contact({
    id: maxContactId.toString(),
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    imageUrl: req.body.imageUrl
  });

  contact.save()
    .then(createdContact => {
      res.status(201).json({
        message: 'Contact added successfully',
        contact: createdContact
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

/* Get contact by id */
router.get('/:id', (req, res, next) => {
  const contactId = req.params.id;

  Contact.findOne({ id: contactId })
    .populate('group')
    .then(contact => {
      if(contact){
        res.status(200).json({
          message: 'Contact fetched successfully',
          contact: contact
        });
      } else {
        res.status(404).json({
          message: 'Contact not found',
          contact: null
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

/* Update contact by id */
router.put('/:id', (req, res, next) => {
  const contactId = req.params.id;

  Contact.findOneAndUpdate(
    { id: contactId },
    {
      $set: {
        name: req.body.name,
        description: req.body.description,
        url: req.body.url
      }
    }
  )
  .populate('group')
  .then(updatedContact => {
    res.status(204).json({
      message: 'Contact updated successfully',
      contact: updatedContact
    });
  })
  .catch(error => {
    res.status(500).json({
      message: 'An error occurred',
      error: error
    });
  });
});

/* Delete contact by id */
router.delete('/:id', (req, res, next) => {
  const contactId = req.params.id;

  Contact.findOneAndDelete({ id: contactId })
    .then(() => {
      res.status(204).json({
        message: 'Contact deleted successfully'
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
