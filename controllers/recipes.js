const express = require('express')
const router = express.Router()
const Recipe = require('../models/recipe')

router.get('/', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/sign-in')
  }
  try {
    const recipes = await Recipe.find({ owner: req.session.user._id })
    res.render('recipes/index', { recipes })
  } catch (err) {
    res.redirect('/')
  }
})

router.get('/new', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/sign-in')
  }
  res.render('recipes/new')
})

router.post('/', async (req, res) => {
  try {
    const { name, instructions, ingredients } = req.body
    if (!req.session.user) {
      return res.redirect('/auth/sign-in')
    }
    const newRecipe = new Recipe({
      name,
      instructions,
      owner: req.session.user._id,
      ingredients: ingredients.split(',')
    })
    await newRecipe.save()
    res.redirect(`/recipes`)
  } catch (err) {
    res.status(500).send('Error creating recipe')
  }
})

router.get('/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId)
    if (!recipe) {
      return res.redirect('/')
    }
    res.render('recipes/show', { recipe })
  } catch (err) {
    res.redirect('/')
  }
})

router.get('/:recipeId/edit', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId)
    if (!recipe) {
      return res.redirect('/')
    }
    if (!recipe.owner.equals(req.session.user._id)) {
      return res.redirect('/')
    }
    res.render('recipes/edit', { recipe })
  } catch (err) {
    res.redirect('/')
  }
})

router.put('/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId)
    if (!recipe) {
      return res.redirect('/')
    }
    if (!recipe.owner.equals(req.session.user._id)) {
      return res.redirect('/')
    }
    recipe.name = req.body.name
    recipe.instructions = req.body.instructions
    recipe.ingredients = req.body.ingredients.split(',')
    await recipe.save()
    res.redirect(`/recipes/${recipe._id}`)
  } catch (err) {
    res.redirect('/')
  }
})

router.delete('/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId)
    if (!recipe) {
      return res.redirect('/')
    }
    if (!recipe.owner.equals(req.session.user._id)) {
      return res.redirect('/')
    }
    await Recipe.deleteOne({ _id: req.params.recipeId })
    res.redirect('/recipes')
  } catch (err) {
    res.redirect('/')
  }
})

module.exports = router