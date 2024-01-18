# Pomo
#### An AMOLED Black Chrome Extension timer.

# Description

**Pomo** is a project of mine, developed using JavaScript, HTML, and CSS. It is an AMOLED Black Chrome Extension Timer designed for manifest v3 of Chrome.

The project consists of several files, with the main logic implemented in the `popup.js` file, which has approximately 187 lines of code in version 1.0. The popup.js file handles the timer functionality, while the background.js file manages alarms and notifications. These files communicate with each other to ensure timely notifications and alarms based on the user's chosen timer duration. In popup.js, DOM elements are initialized, and timer variables are set. The code checks for localStorage support to store and retrieve timer settings. It also checks if there was a previous timer and updates the UI accordingly.

Event listeners are set for buttons: left, right, and middle. The left button allows users to input a custom timer duration, which updates the default timer value and stores it in localStorage. The right button resets the timer if it is paused. The middle button controls the start/pause functionality of the timer, sending messages to background.js to start or pause the timer accordingly.

The timer allows users to set a custom value ranging from 1 to 59 minutes. It provides a user-friendly interface for setting the timer duration and displays the countdown in the popup window. Users can easily start, pause, and reset the timer as needed.

To alarm the user, the project includes a `background.js` file that utilizes the `chrome.alarms` and `chrome.notifications` APIs where the `chrome.notifications` listens for an alarm to set off for it to notify the user. The `background.js` file communicates with the `popup.js` file by receiving messages and performing actions accordingly. This allows for timely notifications and alarms based on the timer duration set by the user.

# Future improvements

In addition to the core functionality, there're plans for future improvements. These include integrating ChatGPT into the extension, which would enable interactive conversations and personalized timer settings. I also intend to implement timer profiles with predefined durations (can be customized), providing users with the ability to choose different timer presets based on their needs. Furthermore, CSS animations are planned to be incorporated to create a visually appealing experience and an actual Pomodoro timer.

Overall, Pomo is a simple Chrome Extension Timer that offers customizable timer durations and aims to provide a productive and visually pleasing timer experience for users.
