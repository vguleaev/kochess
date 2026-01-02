# Product Requirements Document (PRD)

## Overview

Kochess is an AI-powered collection of your favorite recipes, designed to help users discover, save, and share recipes effortlessly.

The application leverages modern web technologies to provide a seamless user experience.

## Features

- **User Authentication**: Secure login and registration.
- **PWA Support**: Progressive Web App capabilities for offline access and app-like experience.
- **Recipe Management**: User can create, edit, and delete their recipes. Automatically calculate and display the calorie content of recipes.
- **Onboarding journey**: During registration users select age, height, weight, sex, and activity level to calculate their daily calorie intake.
- **User profile**: User can view and edit their profile information, including personal details and dietary preferences.
- **Search Functionality**: Users can search for recipes by ingredients, cuisine, or dietary restrictions.
- **AI-Powered Recommendations**: Suggest recipes based on user preferences and recopies (AI feature).
- **Mobile App Design**: App optimized for mobile devices.

## Recept Management details

Recipe has few fields:

- Title
- Photo (default image fallback)
- Description (optional, free text)
- Ingredients (optional, free text)

Automatically extract with AI amount of calories (per 100 gram). Store it in the database (async way).

## Calorie Tracking

User can view daily calorie intake in the app header. It is calculated based on the user's profile information (age, height, weight, activity level).

## User Profile details

User can view and edit their profile information, including:

- Age
- Height
- Weight
- Activity Level (sedentary, lightly active, moderately active, very active, super active)

## AI-Powered Recommendations details

AI-powered recommendations will suggest recipes based on user preferences and previously saved recipes. The AI will analyze user behavior and preferences to provide personalized suggestions.

User can generate a recipe using AI. User can provide a list of ingredients and AI will generate a recipe based on those ingredients.

After getting a recipe from AI, user can save it to their collection or discard it.

One recommended recipe generation by AI costs 1 credit. User can buy credits in the app.
