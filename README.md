# Covey.Town

Covey.Town provides a virtual meeting space where different groups of people can have simultaneous video calls, allowing participants to drift between different conversations, just like in real life.
Covey.Town was built for Northeastern's [Spring 2021 software engineering course](https://neu-se.github.io/CS4530-CS5500-Spring-2021/), and is designed to be reused across semesters.
You can view our reference deployment of the app at [app.covey.town](https://app.covey.town/), and our project showcase ([Fall 2022](https://neu-se.github.io/CS4530-Fall-2022/assignments/project-showcase), [Spring 2022](https://neu-se.github.io/CS4530-Spring-2022/assignments/project-showcase), [Spring 2021](https://neu-se.github.io/CS4530-CS5500-Spring-2021/project-showcase)) highlight select student projects.

![Covey.Town Architecture](docs/covey-town-architecture.png)

The figure above depicts the high-level architecture of Covey.Town.
The frontend client (in the `frontend` directory of this repository) uses the [PhaserJS Game Library](https://phaser.io) to create a 2D game interface, using tilemaps and sprites.
The frontend implements video chat using the [Twilio Programmable Video](https://www.twilio.com/docs/video) API, and that aspect of the interface relies heavily on [Twilio's React Starter App](https://github.com/twilio/twilio-video-app-react). Twilio's React Starter App is packaged and reused under the Apache License, 2.0.

A backend service (in the `townService` directory) implements the application logic: tracking which "towns" are available to be joined, and the state of each of those towns.

## Running this app locally

Running the application locally entails running both the backend service and a frontend.

### Setting up the backend

To run the backend, you will need a Twilio account. Twilio provides new accounts with $15 of credit, which is more than enough to get started.
To create an account and configure your local environment:

1. Go to [Twilio](https://www.twilio.com/) and create an account. You do not need to provide a credit card to create a trial account.
2. Create an API key and secret (select "API Keys" on the left under "Settings")
3. Create a `.env` file in the `townService` directory, setting the values as follows:

| Config Value            | Description                               |
| ----------------------- | ----------------------------------------- |
| `TWILIO_ACCOUNT_SID`    | Visible on your twilio account dashboard. |
| `TWILIO_API_KEY_SID`    | The SID of the new API key you created.   |
| `TWILIO_API_KEY_SECRET` | The secret for the API key you created.   |
| `TWILIO_API_AUTH_TOKEN` | Visible on your twilio account dashboard. |

### Starting the backend

Once your backend is configured, you can start it by running `npm start` in the `townService` directory (the first time you run it, you will also need to run `npm install`).
The backend will automatically restart if you change any of the files in the `townService/src` directory.

### Configuring the frontend

Create a `.env` file in the `frontend` directory, with the line: `NEXT_PUBLIC_TOWNS_SERVICE_URL=http://localhost:8081` (if you deploy the towns service to another location, put that location here instead)

For ease of debugging, you might also set the environmental variable `NEXT_PUBLIC_TOWN_DEV_MODE=true`. When set to `true`, the frontend will
automatically connect to the town with the friendly name "DEBUG_TOWN" (creating one if needed), and will *not* try to connect to the Twilio API. This is useful if you want to quickly test changes to the frontend (reloading the page and re-acquiring video devices can be much slower than re-loading without Twilio).

### Running the frontend

In the `frontend` directory, run `npm run dev` (again, you'll need to run `npm install` the very first time). After several moments (or minutes, depending on the speed of your machine), a browser will open with the frontend running locally.
The frontend will automatically re-compile and reload in your browser if you change any files in the `frontend/src` directory.

### Stop Motion Instructions

Clone the repository. (e.g., git clone git@github.com:neu-cs4530/covey-town-project-team-603.git) to use the ssh protocol.
In `frontend`, you must write an .env file. A file with the contents:
NEXT_PUBLIC_TOWNS_SERVICE_URL=http://localhost:8081 NEXT_PUBLIC_TOWN_DEV_MODE=true
Is sufficient. The first variable sets the backend URL. The second disables Twilio video support and town selection, as appropriate for a local installation.
In `townService`, (e.g., the backend), run `npm install`, and `npm start`. Wait for the output, `Listening on 8081`.
(In another terminal), In `frontend`, run `npm install --force`. Then run `npm start`, so as to populate the `generated` folder. Then, `npm run dev` runs the frontend. See https://github.com/konvajs/react-konva/issues/710 -- it is necessary to install konva ^9.0.0 to make Konva importing play nicely with jest, but that necessitates upgrading react-konva to ^18.0.0. But that in turn necessitates upgrading all react peer-depending packages to use react ^18.0.0, which is a significant task that we feel is out of scope.
You should now be able to visit the service at the default URL, http://localhost:3000. 
To try out the feature, enter the area labeled “Stop Motion” and press spacebar.

### Manual Testing Script
Since the vast majority of our functionality is canvas-related (and therefore, difficult to test automatically), the following human script serves to guide someone through a manual testing session.

#### Testing the interactable basics
1. When entering the covey.town instance, the stop motion interactable area should be present.
2. Pressing spacebar in the area should bring up the editor modal.
#### Testing the homescreen basics
1. Once in the modal, you should see a screen including some helpful information, and a button to enter the editor. Clicking this button should make the editor appear. Once in the editor, clicking on “navigate home” should bring you back.
2. Testing the bounds of the arrow buttons
3. Since opening up the editor loads a default animation with a single empty frame, now is a good time to test the arrow buttons for correctness. In this state, pressing either arrow button should have no apparent effect.
#### Testing the figure positioning
1. Figure positioning took a fair bit of custom code to get right. Therefore, it is important to test well.
2. Click the “add animal” button on the left. A (single) cow-looking creature should pop up in the canvas. The animal is composed of six shapes – a rectangular torso, four rectangular legs, and a circular head.
3. Click and drag on the rectangular torso – move the cursor around. The entire body of the animal should move linear-wise.
4. Now, click-and-drag the circular head. The motion should be an intuitive rotation around the visible attachment point to the torso.
5. Imagine a vector pointing outwards from the attachment point of the head to the furthest-away part of the circular head. This vector’s mathematical angle (with the x-axis, for instance) should match the angle that a vector drawn from the attachment point to the cursor would have.
6. One failure mode is that the entire angle of the cursor drag, from the attachment point, is applied with every single dragMove handler. This manifests as extremely rapid rotation that doesn’t follow the cursor. Ensure that this does not happen. Leave the head in some non-default position.
7. Now, click-and-drag some of the rectangular legs. Rectangles, unlike circles, are not radially symmetric. The behavior listed above should still apply. Leave some of the legs in a non-default position.
8. The model should now be intuitive. Repeat the above steps with the Person figure, and the Bird figure. Note that the Bird figure is special, for its triangular “wings” are set to not rotate.
#### Test the simple shapes
1. There are three simple shape types offered (circle, star, rectangle). Their motion is linear. Add at least one shape of each kind, and move it to a non-default position.
#### Test the text entry
1. Add some text to the textarea on the left, and hit the Add Text button. That text should appear on the screen. Click and drag – it should follow the cursor. Move it to a non-default position.
#### Congratulations – you are now ready to add your first frame.
1. Click the ‘Add Latest Frame’ button.
2. The frame counter in the top left should now read 2/2.
3. To meaningfully test frames, the next frame should be different. Move the various things you added to frame 1 to different positions, or rotations. You should see that the previous frame is displayed in grey (i.e., with transparency).
4. Clicking the arrow buttons should let you move between the two frames you have now.
5. Clicking “playback” should playback the animation so far.
6. Clicking “export movie” should playback the animation in a similar fashion. Then, once encoded, a .gif should automatically be saved to your browser’s downloads folder. (NOTE: This has been reported to only work on firefox. Presumably due to the use of web workers.)
7. Inspect the .gif with your favorite animated image viewer. Your browser should do. It should depict the state of the animation so far.
8. Since the animation now has two frames with content, now is a good time to test project save and load. Open another tab of covey.town, and repeat the steps to enter the animation studio.
#### Testing Save/Open Animation Feature
1. Create a frame using instructions for creating the first frame above.
2. Press the Save Project button in the bottom control panel.
3. Open/save the downloaded .json animation file to an accessible location.
4. Reload the webpage and re-open the Stop Motion Studio.
5. Click through the title page, to the Stop Motion Editor
6. Click the Load Project button and select local file path to saved .json
7. Visually confirm each frame is the same, to ensure that the save animation is functioning as expected
