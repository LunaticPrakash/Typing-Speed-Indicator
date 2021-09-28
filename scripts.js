const TIME_LIMIT = 10;
let quotes_array = [
    "Push yourself, because no one else is going to do it for you.",
    "Failure is the condiment that gives success its flavor.",
    "Wake up with determination. Go to bed with satisfaction.",
    "It's going to be hard, but hard does not mean impossible.",
    "Learning never exhausts the mind.",
    "The only way to do great work is to do what's needed."
];

// Selecting html elements
let error_txt = document.querySelector("#error");
let time_txt = document.querySelector("#time");
let accuracy_txt = document.querySelector("#accuracy");
let wpm_txt = document.querySelector("#wpm");

let given_txt = document.querySelector("#given-text");
let input_txt_area = document.querySelector("#input-text-area");
let restart_btn = document.querySelector(".restart-btn");

// Define main global varibales
let game_started = false;
let time_left = TIME_LIMIT;
let time_elapsed = 0;
let total_errors = 0;
let errors = 0;
let accuracy = 0;
let character_typed = 0;
let curr_input = "";
let curr_quote = "";
let quote_count = 0;
let timer = null;
let num_valid_char_typed = 0; //doesn't count characters removed via del/backspace

// Will first set given_txt field null(to avoid overwriting)
// then change it to next quote
function updateGivenText() {
    curr_quote = quotes_array[quote_count];
    given_txt.textContent = null;

    // it will wrap every character inside <span> tag
    // so that we can later change their color individually
    curr_quote.split('').forEach((char) => {
        const charSpan = document.createElement('span');
        charSpan.innerText = char;
        given_txt.appendChild(charSpan)
    });

    // loop through quotes if reached the end
    if (quote_count < quotes_array.length - 1)
        quote_count++;
    else
        quote_count = 0;
}

// will check whether each character typed is correct or not
function checkError(input_char_array, ori_char, idx) {
    let typed_char = input_char_array[idx];

    if (typed_char == null) {
        ori_char.classList.remove('correct_char');
        ori_char.classList.remove('incorrect_char');
    }

    else if (typed_char === ori_char.innerText) {
        ori_char.classList.add('correct_char');
        ori_char.classList.remove('incorrect_char');
    }

    else {
        ori_char.classList.add('incorrect_char');
        ori_char.classList.remove('correct_char');
        errors++;
    }
}

function updateTimer() {
    if (time_left > 0) {
        time_left--;
        time_elapsed++;
        time_txt.innerText = time_left + "s";
    }
    else {
        console.log("Time Finished!");
        finishGame();
    }
}

// will read input from user character by character
function processUserInput() {
    console.log("errors = ", errors);
    console.log("total_errors = ", total_errors);
    errors = 0;
    character_typed = character_typed + 1;
    // below condition will prevent timer function to get called multiple times
    if (game_started == false)
        timer = setInterval(updateTimer, 1000);
    game_started = true;

    // Read input and extract each character
    curr_input = input_txt_area.value;   // contains everything that user has entered
    let input_char_array = curr_input.split('');
    num_valid_char_typed = input_char_array.length;
    let curr_typed_char = input_char_array[num_valid_char_typed - 1];

    let given_txt_span_array = given_txt.querySelectorAll("span");
    given_txt_span_array.forEach((item, index) => {
        checkError(input_char_array, item, index)
    });

    // displaying stats
    error_txt.innerText = total_errors + errors;

    let wpm = (num_valid_char_typed / time_elapsed) * 60;
    wpm_txt.innerText = (wpm / 5).toFixed(0);

    let correct_char = input_char_array.length - (total_errors + errors)
    if (correct_char < 0)
        correct_char = 0;

    let curr_accuracy = (correct_char / input_char_array.length) * 100;
    curr_accuracy = Math.abs(curr_accuracy);
    if (curr_accuracy % 1 != 0) // if it's float
        curr_accuracy = curr_accuracy.toFixed(2);

    accuracy_txt.innerText = curr_accuracy + "%";

    // when current given quote is typed completely by user
    if (curr_input.length === curr_quote.length) {
        updateGivenText();
        total_errors += errors;
        // errors = 0
        input_txt_area.value = "";
    }

}

function startGame() {
    reset();
    updateGivenText();
}

function reset() {

    clearInterval(timer);
    game_started = false;
    time_left = TIME_LIMIT;
    time_elapsed = 0;
    total_errors = 0;
    errors = 0;
    accuracy = 0;
    character_typed = 0;
    curr_input = "";
    curr_quote = "";
    timer = null;
    input_txt_area.disabled = false;
    input_txt_area.value = "";
    time_txt.innerText = 10;
    wpm_txt.innerText = 0;
    accuracy_txt.innerText = 100;
    error_txt.innerText = 0;
    given_txt.innerText = quotes_array[0];

}

function finishGame() {
    clearInterval(timer);
    input_txt_area.disabled = true;
    game_started = false;
    given_txt.innerText = "Click on reset to start a new game.";
    let wpm = (num_valid_char_typed / time_elapsed) * 60;
    wpm_txt.innerText = (wpm / 5).toFixed(0);
}



