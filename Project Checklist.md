Quiz Project Checklist
==================
## Start
- [x] Fork project
- [x] Clone repo
- [x] Plan Project

## Code
- [x] Replace the 'quiz selector' with link add feature
	- [x] Access Local Storage for previous quiz data
	- [x] Create Form
		- [x] Enter Name
		- [x] Enter Link
		- [x] Passing Grade (percentage)
	- [x] Save form data to localStorage
	- [x] Navigate to Quiz
- [x] Update Google Apps script for your format
	- [x] Add Options to their own nested object
- [x] Redo Quiz Code
	- [x] Add CSS Loading Screen to replace existing .gif
	- [x] Update for multiple choice Radio Buttons
	- [x] Create Submit Answer Code
	- [x] Update for Checkbox questions
	- [x] Remove instant feedback
- [ ] Quiz End Summary
	- [x] Compute Final Score
	- [ ] List High Scores
	- [ ] Answer's stored in array till end of quiz = Needs Testing
	- [ ] List all correct/incorrect question/answers
		- [ ] Incorrect answers section
		- [ ] Correct answers section
- [ ] Add high-score section
	- [ ] Update localstorage with new data
	- [ ] Add link to high score screen on the start quiz screen
- [ ] localStorage CRUD functions for quiz list
	- [x] CREATE
	- [x] READ
	- [ ] UPDATE
		- [x] Find Unique ID solution
		- [ ] Redirect to add quiz form / copy of form
		- [ ] pre-populate with info
		- [ ] submit to update specific record
	- [ ] DELETE
		- [ ] update the same form to have a delete button instead of submit

## Style
- [ ] Update Styling
	- [x] Mobile First Styling
	- [ ] Update for Desktop

## Test
- [ ] Add testing with jest

# Debugging
- [x] Test on PC
	- [x] Does the quiz work?
	- [x] Can new quiz be added and access later?
- [x] Test on Mobile
	- [x] Does the quiz work?
	- [x] Can new quiz be added and access later?
	- [ ] Localstorage on mobile not working sometimes?

## Readme
- [ ] Add in depth instructions template files
	- [x] Create template gooogle sheet
	- [ ] Write instructions for: 
		- [ ] inserting code into sheet
		- [ ] deploying code
		- [ ] find a way to do this for mobile users

