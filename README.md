#  DoomClock
⏳ A procrastination killer app that uses your life clock and existential dread to make you actually get things done.

## Project Description
DoomClock is a web application designed to help users reduce procrastination and manage their time more effectively. The application shows a real-time life clock based on the user's birthdate, allows users to add tasks with deadlines and priorities, track completed and overdue tasks, and sends failed tasks to a Procrastination Graveyard. The application also provides motivational quotes, random activity suggestions, and tough-love advice using public APIs.

## Objectives of the Project
- To build a web application using HTML, CSS, and JavaScript
- To integrate public APIs using fetch
- To implement search, filter, and sort using Array Higher Order Functions
- To store user data using local storage
- To create a responsive user interface
- To deploy the project online

---

## APIs Used

1. **DummyJSON Quotes API**
   Used to fetch random motivational quotes.
   `https://dummyjson.com/quotes/random`
   Returns: `{ quote: "...", author: "..." }`

2. **TheMealDB API**
   Used to fetch random meal/activity suggestions when the user is stuck.
   `https://www.themealdb.com/api/json/v1/1/random.php`
   Returns: `{ meals: [{ strMeal: "...", strCategory: "..." }] }`

3. **Advice Slip API**
   Used to fetch random tough-love advice messages.
   `https://api.adviceslip.com/advice`
   Returns: `{ slip: { advice: "..." } }`

> All APIs are free and require no API key or authentication.

---

## Features of the Application

### Core Features
- Real-time life clock based on user's birthdate (years, days, hours, seconds)
- Add tasks with name, deadline, and priority level (High / Medium / Low)
- Mark tasks as completed with a Done button
- Track overdue tasks automatically
- Procrastination Graveyard — overdue deleted tasks appear as tombstones
- Reclaimed Time Streak — tracks how many tasks you complete
- Show motivational quotes (auto-loaded + refreshable)
- Suggest random cooking activities (auto-loaded + refreshable)
- Show tough-love advice (auto-loaded + refreshable)

### Interactive Features
- Search tasks by keyword
- Filter tasks by status — All / Pending / Completed / Overdue
- Sort tasks by Deadline, Priority, or Name A–Z
- Favourite/star any task using the ⭐ button
- Dark mode / Light mode toggle (default: dark)

### Additional Features
- Local storage — tasks, graveyard, favourites, and theme saved across sessions
- Loading indicators (spinner animation) during all API calls
- Fully responsive design for mobile, tablet, and desktop
- Smooth card animations and hover effects
- Sticky navbar with smooth scroll links

---

## Array Higher Order Functions Used
All search, filter, and sort operations use Array HOFs. No traditional for or while loops are used.

- `filter()` — Used for searching tasks by keyword and filtering by status
- `sort()` — Used to sort tasks by deadline, priority, or name
- `map()` — Used to render each task and graveyard tombstone as HTML
- `find()` — Used to locate a specific task before deleting it

---

## Bonus Features Implemented

- **Debouncing** — Search input waits 300ms after the user stops typing before filtering, improving performance
- **Local Storage** — All tasks, favourites, graveyard data, and dark/light theme preference are saved in the browser and persist after refresh

---

## Technologies Used
- HTML5
- CSS3 (CSS Variables, Flexbox, Grid, Animations)
- JavaScript (ES6+)
- Fetch API
- Local Storage
- Array Higher Order Functions
- Google Fonts (Poppins)
- GitHub
- Responsive Web Design

---

## How to Run the Project

1. Clone the repository
   ```
   git clone https://github.com/YOUR_USERNAME/doomclock.git
   ```
2. Open the project folder
   ```
   cd doomclock
   ```
3. Open `index.html` in any web browser

Or use the **Live Server** extension in VS Code for auto-reload on save.

---

## Project Structure
```
doomclock/
├── index.html     ← Page structure and layout
├── style.css      ← All styling, themes, responsive design
├── script.js      ← API calls, task logic, HOFs, local storage
└── README.md      ← Project documentation
```

---

## Conclusion
DoomClock helps users manage their tasks and reduce procrastination by combining a real-time life clock with a full task manager and daily API-powered inspiration. It demonstrates practical implementation of JavaScript concepts including API integration with fetch, array higher order functions, local storage, debouncing, and responsive web design.

> *"Lost time is never found again."* — Benjamin Franklin
