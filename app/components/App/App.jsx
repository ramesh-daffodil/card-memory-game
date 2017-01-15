import React from 'react';

require('./App.css');
import _ from 'underscore';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			deck1: [],
			deck2: [],
			recentCard: null,
			turns: 0,
			matched: 0,
			players: []
		};
		this.openCard.bind(this);
		this.shuffleCards.bind(this);
		this.resetHighScore.bind(this);
	}
	resetHighScore () {
		this.setState((state) => {
			state.players = [];
			return state;
		})
	}
	openCard (deck, card, index) {
		if(!this.state.recentCard && deck == "deck2"){
			return alert("Please open a card from deck1 first.");
		}
		var deck_id = (deck == "deck1") ? "nh092zdxar0e" : "yo5p23nho50e";
		this.setState((state) => {
			state[deck][index]["opened"] = true;
			return state;
		});
		let recentCard = this.state.recentCard;
		if(deck == "deck1") {
			if(!recentCard){
				this.setState((state) => {
					state.recentCard = state[deck][index];
					state.recentCard.index = index;
					return state;
				});
			} else {
				this.setState((state) => {
					state[deck][index]["opened"] = false;
					return state;
				});
			}
		} else {
			if(recentCard) {
				if(card.code != recentCard.code) {
					setTimeout(()=> {
						this.setState((state) => {
							state[deck][index]["opened"] = false;
							state["deck1"][state.recentCard.index]["opened"] = false;
							state.recentCard = null;
							return state;
						});
					},2000);
				} else {
					this.setState((state) => {
						state.matched++;
						return state;
					});
				}
				this.setState((state) => {
					state.turns++;
					return state;
				});
			}
		}
		if(this.state.matched == 52) {
			var playerName = prompt("Enter your name.");
			this.setState((state) => {
				state.players.push({
					name: playerName,
					turns: state.turns
				});
				state.turns = 0;
				state.matched = 0;
				return state;
			});
			this.shuffleCards();
		}
	}
	shuffleCards() {
		this.setState((state) => {
			return {
				deck1: [],
				deck2: [],
				recentCard: null,
				turns: 0,
				matched: 0,
				players: [{name: "Surya", turns: 10}]
			}
		})
		fetch("https://deckofcardsapi.com/api/deck/nh092zdxar0e/shuffle", {mode: 'no-cors'})
		.then(()=> {
			fetch("https://deckofcardsapi.com/api/deck/nh092zdxar0e/draw/?count=52")
			.then((response) => response.json())
			.then((data) => {
				this.setState((state) => {
					state.deck1 = data.cards;
					return state;
				})
			});
		})
		fetch("https://deckofcardsapi.com/api/deck/yo5p23nho50e/shuffle", {mode: 'no-cors'})
		.then(()=> {
			fetch("https://deckofcardsapi.com/api/deck/yo5p23nho50e/draw/?count=52")
			.then((response) => response.json())
			.then((data) => {
				this.setState((state) => {
					state.deck2 = data.cards;
					return state;
				})
			})
		})
	}
	componentDidMount() {
		this.shuffleCards();
	}

	componentWillUnmount() {
		this.timer = clearInterval(this.timer);
	}

	render() {
		return (
			<div>
				<div>
					<div>
						<button onClick={this.shuffleCards.bind(this)}>
							Play/Shuffle
						</button>
						<button onClick={this.resetHighScore.bind(this)}>
							Reset Highscore
						</button>
						<span style={{float: "right"}}>Turns so far: <b>{this.state.turns}</b></span>
					</div>
					<fieldset>
						<legend>Deck 1</legend>
						{
							this.state.deck1.map((card, i) => {
								return <img key={i} onClick={this.openCard.bind(this, "deck1", card, i)} src={card.opened ? card.image : "./img/Back.png"} width="53.5" height="75" />
							})
						}
					</fieldset>
					<fieldset>
						<legend>Deck 2</legend>
						{
							this.state.deck2.map((card, i) => {
								return <img key={i} onClick={this.openCard.bind(this, "deck2", card, i)} src={card.opened ? card.image : "./img/Back.png"} width="53.5" height="75" />
							})
						}
					</fieldset>
					<br />
					<br />
					<h3>Highscores</h3>
					<table>
						<thead>
							<tr>
								<th>#</th>
								<th>Turns</th>
								<th>Name</th>
							</tr>
							{this.state.players.map((player, i) => {
								return (<tr key={i}>
									<td>{i+1}</td>
									<td>{player.turns}</td>
									<td>{player.name}</td>
								</tr>)
							})}
						</thead>
					</table>
				</div>
			</div>
		);
	}
}

export default App;
