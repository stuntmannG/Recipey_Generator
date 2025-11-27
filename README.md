# recipey_generator + Firebase

Features
- Google AI generates recipes from ingredients
- Firebase Auth(Email/Password)
- Firestore auto-saves each generated recipe
- Protected routes and a My Recipes page (real-time)
- Corner GIF overlay on the Recipe page

## Setup
1. 
2. Firebase Console
   - Enable Authentication → Email/Password
   - Add `http://localhost:3000` to  → Settings → Authorized domains
   - Enable Firestore
3. Install & run:
```bash
npm install
npm start
```

Model: `gemini-1.5-flash` via `@google/generative-ai`.

Firestore
Each recipe is saved in collection `recipes` with:
`uid, email, prompt, recipeText, createdAt`.

Open /my_recipes to view or delete.
