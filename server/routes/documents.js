const express = require('express');
const router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Document = require('../models/document');

/* List documents */
router.get('/', (req, res, next) => {
  Document.find()
    .populate('children')
    .then(documents => {
      res.status(200).json({
        message: 'Documents fetched successfully',
        documents: documents
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

/* Create new document */
router.post('/', (req, res, next) => {
  const maxDocumentId = sequenceGenerator.nextId('documents');

  const document = new Document({
    id: maxDocumentId.toString(),
    name: req.body.name,
    description: req.body.description,
    url: req.body.url
  });

  document.save()
    .then(createdDocument => {
      res.status(201).json({
        message: 'Document added successfully',
        document: createdDocument
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

/* Get document by id */
router.put('/:id', (req, res, next) => {
  const documentId = req.params.id;

  Document.findOne({ id: documentId })
    .populate('children')
    .then(document => {
      res.status(200).json({
        message: 'Document fetched successfully',
        document: document
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

/* Update document by id */
router.put('/:id', (req, res, next) => {
  const documentId = req.params.id;

  Document.findOneAndUpdate(
    { id: documentId },
    {
      $set: {
        name: req.body.name,
        description: req.body.description,
        url: req.body.url
      }
    }
  )
  .populate('children')
  .then(updatedDocument => {
    res.status(204).json({
      message: 'Document updated successfully',
      document: updatedDocument
    });
  })
  .catch(error => {
    res.status(500).json({
      message: 'An error occurred',
      error: error
    });
  });
});

/* Delete document by id */
router.delete('/:id', (req, res, next) => {
  const documentId = req.params.id;

  Document.findOneAndDelete({ id: documentId })
    .then(() => {
      res.status(204).json({
        message: 'Document deleted successfully'
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
