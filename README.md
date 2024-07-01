## Design Decisions and Project Structure
### Design Decisions
1.Priortize User Interface:
The primary focus of the app is to provide a clean, intuitive, and user-friendly interface. This ensures that users can quickly add, manage, and complete tasks without any confusion or clutter.

2.File Sturture:
The app is designed with a modular architecture to ensure scalability and maintainability. Each feature or functionality is encapsulated in its own module, making it easier to manage and extend the app in the future.

3.State Management:
For state management, the app uses React Context API to handle the global state. This allows for a more predictable and centralized state management system, making it easier to manage the app's state and debug any issues.

4.Responsive Design:
The app is built with respThe project structure is organized to maintain a clean separation of concerns and to ensure ease of navigation and development.

### Project Structure

```bash
├── assets                               # Assets such as images, fonts, etc.
│
├── src                                  # Reusable UI components
    ├── navigation         
        └── navigations.tsx              # File for placing all navigation (stack)
    ├── screens       
│   │   ├── root.tsx                     # Screen on app load
│   │   └── home.tsx                     # Screen for displaying dashboard on logged in
│   │   └── login.tsx                    # Screen for logging in or register
│   │   └── task.tsx                     # Personalise screen for all tasks 
│   ├── state_management         
│   |   ├── context_provider.tsx         # Data/functions provider for context
│   |   └── context.tsx                  # Context for managing user/task
├── libs                                 # For future api calls
```
## How to Clone and Start the Project

Follow these steps to clone the repository and start the Expo project on your local machine:

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 12 or later)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Steps to Clone and Start the Project

1. **Clone the Repository**

   Open your terminal and run the following command to clone the repository:

   ```bash
   git clone https://github.com/your-username/your-repository-name.git
   ```

   Replace `your-username` and `your-repository-name` with your actual GitHub username and repository name.

2. **Navigate to the Project Directory**

   Change into the project directory:

   ```bash
   cd your-repository-name
   ```

3. **Install Dependencies**

   Install the necessary dependencies using npm or yarn:

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

4. **Start the Expo Project**

   Once the dependencies are installed, you can start the Expo project:

   ```bash
   npx expo start
   ```

   or

   ```bash
   expo start
   ```

5. **Open the Project in Expo**

   After running the above command, Expo DevTools will open in your browser. You can then use the Expo Go app on your phone or an emulator to view the project.

### Troubleshooting

- If you encounter any issues with dependencies, try deleting the `node_modules` directory and `package-lock.json` (or `yarn.lock`) file, then run the installation command again:

  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

  or

  ```bash
  rm -rf node_modules yarn.lock
  yarn install
  ```

- Ensure that your Node.js version is compatible with the project requirements.

- Check the Expo documentation for more detailed troubleshooting: [Expo Documentation](https://docs.expo.dev/).

### Additional Notes

- For a better development experience, consider using a code editor like [Visual Studio Code](https://code.visualstudio.com/).

- Regularly pull the latest changes from the repository to keep your local copy up to date:

  ```bash
  git pull origin main
  ```

By following these instructions, you should be able to successfully clone and start the Expo project on your local machine.
