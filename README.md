# Guitar Strum Counter

A React application designed to help guitarists track strums during practice sessions with an integrated metronome.

## Features

- **Strum Counter**: Automatically counts strums in sync with the metronome beat
- **Adjustable Tempo**: Set your desired practice tempo from 30-240 BPM
- **Audio Feedback**: Optional metronome sounds to help you stay in rhythm
- **Milestone Announcements**: Voice announcements at every 100 strums to track your progress
- **Simple Interface**: Clean, intuitive design focused on practice efficiency

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/guitar-strum-counter.git
cd guitar-strum-counter
```

2. Install dependencies
```
npm install
# or
yarn install
```

3. Start the development server
```
npm start
# or
yarn start
```

## Usage

1. **Set your tempo** using the metronome controls (adjust BPM with + and - buttons)
2. **Click Start** to begin counting strums
3. **Practice your strumming** in time with the metronome
4. The counter will automatically increment with each beat
5. **Listen for milestone announcements** every 100 strums
6. **Click Stop** when you're finished with your practice session

## Components

### App
The main application component that manages state and orchestrates the counter and metronome.

### Counter
Displays the current strum count with a clean, animated interface.

### Metronome
Controls the tempo and provides audio feedback. Available in standard and compact layouts.

## Customization

The application uses Tailwind CSS for styling, making it easy to customize the appearance by modifying the class names in the component files.

## Technical Details

- Built with React and functional components with hooks
- Uses Web Audio API for precise timing and sound generation
- Incorporates speech synthesis for milestone announcements
- Responsive design works on desktop and mobile devices
