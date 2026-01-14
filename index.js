// Початковий баланс
let balance = 100;

// Масив кольорів
let colors = ["червоний", "чорний", "білий"];

// Граємо, поки користувач не захоче виходити і баланс > 0
while (balance > 0) {
    // Показуємо баланс і запитуємо колір
    let userChoice = prompt("Твій баланс: " + balance + "\nВибери колір: червоний, чорний або білий").toLowerCase();

    // Якщо користувач натиснув "Відміна" або пустий рядок — вихід з гри
    if (userChoice === null || userChoice === "") {
        alert("Ти вийшов з гри. Кінець.");
        break;
    }

    // Перевірка правильності вводу
    if (!colors.includes(userChoice)) {
        alert("Ти ввів неправильний колір! Спробуй ще раз.");
        continue;
    }

    // Випадковий колір казино
    let casinoChoice = colors[Math.floor(Math.random() * colors.length)];
    alert("Казино вибрало: " + casinoChoice);

    // Перевірка виграшу
    if (userChoice === casinoChoice) {
        balance += 10;
        alert("Вітаю! Ти виграв 10. Тепер твій баланс: " + balance);
    } else {
        balance -= 10;
        alert("На жаль, ти програв 10. Тепер твій баланс: " + balance);
    }

    // Перевірка, чи закінчилися гроші
    if (balance <= 0) {
        alert("У тебе закінчилися гроші. Гра закінчена!");
        break;
    }

    // Запитати, чи хоче користувач грати ще раз
    let again = confirm("Хочеш зіграти ще раз?");
    if (!again) {
        alert("Дякую за гру! Твій баланс: " + balance);
        break;
    }
}
