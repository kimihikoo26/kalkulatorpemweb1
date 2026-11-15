// Ambil elemen layar dari HTML agar bisa diubah lewat JavaScript.
const currentOperandElement = document.getElementById("current-operand");
const previousOperandElement = document.getElementById("previous-operand");
const keypad = document.querySelector(".keypad");

// Variabel untuk menyimpan angka dan operasi yang sedang dipilih.
let currentOperand = "0";
let previousOperand = "";
let operator = null;
let shouldResetScreen = false;

// Menampilkan nilai variabel ke layar kalkulator.
function updateDisplay() {
    currentOperandElement.textContent = currentOperand;
    previousOperandElement.textContent = operator
        ? `${previousOperand} ${operator}`
        : "";
}

// Menambahkan angka yang ditekan ke angka saat ini.
function appendNumber(number) {
    if (currentOperand === "Error" || shouldResetScreen) {
        currentOperand = number;
        shouldResetScreen = false;
    } else if (currentOperand === "0") {
        currentOperand = number;
    } else if (currentOperand.length < 14) {
        currentOperand += number;
    }

    updateDisplay();
}

// Menambahkan titik desimal, tetapi hanya satu kali.
function addDecimal() {
    if (currentOperand === "Error" || shouldResetScreen) {
        currentOperand = "0";
        shouldResetScreen = false;
    }

    if (!currentOperand.includes(".")) {
        currentOperand += ".";
    }

    updateDisplay();
}

// Menyimpan operator dan angka pertama.
function chooseOperator(selectedOperator) {
    if (currentOperand === "Error") return;

    if (operator !== null && !shouldResetScreen) {
        calculate();
    }

    previousOperand = currentOperand;
    operator = selectedOperator;
    shouldResetScreen = true;
    updateDisplay();
}

// Melakukan perhitungan berdasarkan operator yang dipilih.
function calculate() {
    if (operator === null || shouldResetScreen) return;

    const firstNumber = Number(previousOperand);
    const secondNumber = Number(currentOperand);
    let result;

    switch (operator) {
        case "+":
            result = firstNumber + secondNumber;
            break;
        case "−":
            result = firstNumber - secondNumber;
            break;
        case "×":
            result = firstNumber * secondNumber;
            break;
        case "÷":
            if (secondNumber === 0) {
                currentOperand = "Error";
                previousOperand = "";
                operator = null;
                shouldResetScreen = true;
                updateDisplay();
                return;
            }
            result = firstNumber / secondNumber;
            break;
        default:
            return;
    }

    // Membatasi angka desimal panjang agar layar tetap rapi.
    currentOperand = String(Number(result.toPrecision(10)));
    previousOperand = "";
    operator = null;
    shouldResetScreen = true;
    updateDisplay();
}

// Menghapus semua angka dan operasi.
function clearCalculator() {
    currentOperand = "0";
    previousOperand = "";
    operator = null;
    shouldResetScreen = false;
    updateDisplay();
}

// Menghapus satu karakter terakhir.
function deleteNumber() {
    if (currentOperand === "Error" || shouldResetScreen) {
        currentOperand = "0";
        shouldResetScreen = false;
    } else if (currentOperand.length > 1) {
        currentOperand = currentOperand.slice(0, -1);
        if (currentOperand === "-") currentOperand = "0";
    } else {
        currentOperand = "0";
    }

    updateDisplay();
}

// Mengubah angka menjadi persentase.
function convertPercent() {
    if (currentOperand !== "Error") {
        currentOperand = String(Number(currentOperand) / 100);
        updateDisplay();
    }
}

// Satu event listener menangani semua tombol pada keypad (event delegation).
keypad.addEventListener("click", function(event) {
    const button = event.target.closest("button");
    if (!button) return;

    if (button.dataset.number !== undefined) {
        appendNumber(button.dataset.number);
    } else if (button.dataset.operator) {
        chooseOperator(button.dataset.operator);
    } else {
        switch (button.dataset.action) {
            case "clear":
                clearCalculator();
                break;
            case "delete":
                deleteNumber();
                break;
            case "decimal":
                addDecimal();
                break;
            case "calculate":
                calculate();
                break;
            case "percent":
                convertPercent();
                break;
        }
    }
});

// Mendukung input keyboard komputer.
document.addEventListener("keydown", function(event) {
    if (/^[0-9]$/.test(event.key)) {
        appendNumber(event.key);
    } else if (event.key === ".") {
        addDecimal();
    } else if (event.key === "+") {
        chooseOperator("+");
    } else if (event.key === "-") {
        chooseOperator("−");
    } else if (event.key === "*") {
        chooseOperator("×");
    } else if (event.key === "/") {
        event.preventDefault();
        chooseOperator("÷");
    } else if (event.key === "Enter" || event.key === "=") {
        calculate();
    } else if (event.key === "Backspace") {
        deleteNumber();
    } else if (event.key === "Escape") {
        clearCalculator();
    } else if (event.key === "%") {
        convertPercent();
    }
});

// Tampilkan angka awal saat halaman pertama kali dibuka.
updateDisplay();
