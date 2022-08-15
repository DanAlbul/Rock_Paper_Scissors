let mainMessage = document.getElementById('main-message');
let subMessage = document.getElementById('sub-message');
const rounds_setup_div = document.getElementById('game_rounds');

const draggables = document.querySelectorAll('.draggable');
const choices = ['rock', 'paper', 'scissors'];

const win_conditions = ['rock-scissors', 'paper-rock', 'scissors-paper'];
const lose_conditions = ['scissors-rock', 'rock-paper', 'paper-scissors'];
const spare_conditios = ['rock-rock', 'paper-paper', 'scissors-scissors'];

let userScore = 0;
let compScore = 0;
const totalRoundsInput = document.getElementById('total_rounds');
let totalRounds = totalRoundsInput.value;
let round = 1;

const userScoreEl = document.getElementById('user-score');
const compScoreEl = document.getElementById('comp-score');
const scoreBoard = document.getElementById('score-board');
const roundLable = document.getElementById('rounds_label');
const choiceContainer = document.getElementById('computer-choice');

let userChoice;
let computerChoice;

let setupArena = (user_choice, comp_choice) => {
	roundLable.innerHTML = 'Round';
	roundLable.style.transition = '1s linear;';
	totalRoundsInput.value = round;
	draggables.forEach((el) => {
		const img = el.firstElementChild;
		el.style.cssText = 'opacity: 0.3;';
		img.removeAttribute('draggable');
		img.classList.remove('scale');
	});
	return new Promise((resolve) => {
		setTimeout(() => {
			const user = choiceContainer.appendChild(user_choice.cloneNode(true));
			user.style.cssText = 'opacity: 1;';
			const comp = choiceContainer.appendChild(comp_choice.cloneNode(true));
			comp.style.cssText = 'opacity: 1;';
			console.log('setup done');
			resolve([user, comp]);
		}, 500);
	});
};

let defineRoundWinner = (user_choice, comp_choice) => {
	const result = user_choice.id + '-' + comp_choice.id;

	if (win_conditions.includes(result)) {
		console.log(userScoreEl);
		return 'user';
	}
	if (lose_conditions.includes(result)) {
		console.log(compScoreEl);
		return 'comp';
	}
	if (spare_conditios.includes(result)) {
		return 'nobody';
	}
};

let defineGameWinner = (user_score, comp_score) => {
	if (userScore > compScore) return 'User is the winner!';
	else if (compScore > userScore) return 'Computer is the winner!';
	else return 'Nobody wins in this game...';
};

let playFightAnimations = (res) => {
	return new Promise((resolve) => {
		const spare_anim = 'animation: shake 0.5s ease-out;';
		const winner = defineRoundWinner(userChoice, computerChoice);
		setTimeout(() => {
			mainMessage.innerHTML = '';
			switch (winner) {
				case 'nobody':
					{
						subMessage.innerHTML = `No one wins in this round :)`;
						res[0].style.cssText = spare_anim;
						res[1].style.cssText = spare_anim;
					}
					break;
				case 'user':
					{
						userScoreEl.innerHTML = ++userScore;
						subMessage.innerHTML = `User (${userChoice.id}) wins Comp (${computerChoice.id}) in this round`;
						res[0].style.cssText = `position: relative; animation: user-fight 0.5s ease-out; z-index: 1000;`;
						setTimeout(() => {
							res[1].style.cssText = `content: url("./assets/${res[1].id}_lose.png")`;
						}, 300);
						res[1].style.cssText = `position: relative; animation: comp-fight 0.5s ease-out;`;
					}
					break;
				case 'comp':
					{
						compScoreEl.innerHTML = ++compScore;
						subMessage.innerHTML = `Comp (${computerChoice.id}) wins User (${userChoice.id}) in this round`;
						setTimeout(() => {
							res[0].style.cssText = `content: url("./assets/${res[0].id}_lose.png");`;
						}, 300);
						res[0].style.cssText = `position: relative; animation: user-fight 0.5s ease-out;`;
						res[1].style.cssText = `position: relative; animation: comp-fight 0.5s ease-out; z-index: 1000;`;
					}
					break;
			}
			resolve(winner);
		}, 1000);
	});
};

let refreshRound = (endgame = false) => {
	choiceContainer.style.cssText = null;
	choiceContainer.innerHTML = '';
	const compHidden = Object.assign(document.createElement('p'), {
		id: 'question',
		innerHTML: '?'
	});
	choiceContainer.appendChild(compHidden);
	draggables.forEach((el) => (el.style.opacity = '1'));
	if (!endgame) mainMessage.innerHTML = ''; //`Round ${round}`;
};

let refreshGame = () => {
	userScore = 0;
	compScore = 0;
	userScoreEl.innerHTML = 0;
	compScoreEl.innerHTML = 0;
	round = 1;
	totalRoundsInput.value = totalRounds;
	roundLable.innerHTML = 'Rounds to play';
	mainMessage.innerHTML = `Drag your choice at <span>?</span> to play again`;
};

let playRounds = () => {
	setupArena(userChoice, computerChoice).then((res) => {
		playFightAnimations(res).then((fight_res) => {
			return new Promise(() => {
				setTimeout(() => {
					console.log(fight_res, 'wins');
				}, 1000);
			}).then(
				setTimeout(() => {
					if (round >= totalRounds) {
						const winner = defineGameWinner(userScore, compScore);
						subMessage.innerHTML = winner;
						refreshRound(true);
						refreshGame();
					} else {
						totalRoundsInput.value = ++round;
						refreshRound();
					}
				}, 2000)
			);
		});
	});
};

const dragstartHandler = (start_event) => {
	userChoice = start_event.target.parentNode;
	computerChoice = draggables[Math.floor(Math.random() * draggables.length)];
	start_event.dataTransfer.dropEffect = 'move';
};

function main() {
	choiceContainer.addEventListener('dragover', (e) => e.preventDefault());
	draggables.forEach((el) => el.addEventListener('dragstart', dragstartHandler));

	totalRoundsInput.addEventListener('input', (e) => {
		totalRounds = e.target.value;
		console.log(totalRounds);
	});

	choiceContainer.ondrop = () => {
		//mainMessage.innerHTML = `Round ${round}`;
		const compHidden = document.getElementById('question');
		draggables.forEach((el) => {
			el.style.cssText = 'animation: append-animate .2s ease-out;';
		});
		choiceContainer.style.cssText = 'border-radius: 0; width: 350px;';
		choiceContainer.removeChild(compHidden);

		playRounds();
	};
}

main();
