import React from 'react';
import ReactDOM from 'react-dom';
import './bootstrap.min.css';
import './index.css';

class PlayersForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      players: this.props.players,
      formData: {
        id: '',
        firstName: '',
        lastName: '',
        score: '',
      },
      errors: {}
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clearForm = this.clearForm.bind(this);
  }

  handleChange(e) {
    var formData = this.state.formData;
    formData[e.target.name] = e.target.value;
    this.setState({formData});
  }

  handleSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.target);

    if (this.validateForm(data) !== false) {
      var players = this.state.players;

      if (data.get('id') === '') {
        this.createPlayer(data, players);
      } else {
        this.updatePlayer(data, players);
      }

      this.setState(players);
    }
  }

  updatePlayer(data, players) {
    players = players.map((player) => {
        if (player.id === parseInt(data.get('id'))) {
          player.firstName = data.get('firstName');
          player.lastName = data.get('lastName');
          player.score = parseInt(data.get('score'));
        }
        return player;
      }
    );
  }

  createPlayer(data, players) {
    const newPlayer = {
      id: (players.length + 1),
      firstName: data.get('firstName'),
      lastName: data.get('lastName'),
      score: parseInt(data.get('score'))
    };

    players.push(newPlayer);
  }

  removePlayer(id) {
    this.setState({
      players: this.state.players.filter((player) => player.id !== id)
    });
  }

  editPlayer(player) {
    this.setState({
      formData: {
        id: player.id,
        firstName: player.firstName,
        lastName: player.lastName,
        score: player.score
      }
    });
  }

  sortPlayers(players) {
    return players.sort((a, b) => {
      if (a.score > b.score) {
        return -1;
      }
      if (a.score === b.score) {
        if (a.lastName < b.lastName) {
          return -1;
        }
      }
      return 0;
    });
  }

  validateForm(data) {
    const firstName = data.get('firstName');
    const lastName = data.get('lastName');
    const score = data.get('score');
    var errors = {};

    if (!firstName || firstName.trim().length === 0) {
      errors.firstName = "First name is required.";
    }
    if (firstName && firstName.match(/^[a-z]+$/i) === null) {
      errors.firstName = "Please enter a correct first name.";
    }
    if (!lastName || lastName.trim().length === 0) {
      errors.lastName = "Last name is required.";
    }
    if (lastName && lastName.match(/^[a-z]+$/i) === null) {
      errors.lastName = "Please enter a correct last name.";
    }
    if (!score || score.trim().length === 0) {
      errors.score = "Score is required.";
    }
    if (score && (score < 0 || score > 100)) {
      errors.score = "Score must be in interval 0-100.";
    }

    var formIsValid = true;
    if (Object.keys(errors).length !== 0) formIsValid = false;
    this.setState({errors: errors });
    return formIsValid;
  }

  clearForm(e) {
    e.preventDefault();
    this.setState({
      formData: {
        id: '',
        firstName: '',
        lastName: '',
        score: ''
      }
    });
  }

  renderPlayers(players) {
    players = this.sortPlayers(players);

    return (
      players.map((player) =>
        <Player
          key={player.id}
          player={player}
          removePlayer={() => this.removePlayer(player.id)}
          editPlayer={() => this.editPlayer(player)}
        />
      )
    );
  }

  renderTable() {
    return (
      <table className="table table-striped table-bordered">
        <thead className="thead-light">
          <tr>
            <th>Name</th>
            <th>Score</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
        {this.renderPlayers(this.state.players)}
        </tbody>
      </table>
    );
  }

  render() {
    return (
      <div className="row">
        <div className="col-xl col-lg-3 col-md-2">&nbsp;</div>
        <div className="col-xl col-lg col-md-8">
          <form onSubmit={this.handleSubmit} id="players-form">
            <FormInput type="text" value={this.state.formData.firstName} onChange={this.handleChange} name="firstName" label="First Name" errors={this.state.errors.firstName}/>
            <FormInput type="text" value={this.state.formData.lastName} onChange={this.handleChange} name="lastName" label="Last Name" errors={this.state.errors.lastName}/>
            <FormInput type="text" value={this.state.formData.score} onChange={this.handleChange} name="score" label="Score" errors={this.state.errors.score}/>
            <input type="hidden" value={this.state.formData.id} onChange={this.handleChange} name="id"/>
            <input type="submit" className="btn btn-primary" value="Submit"/>&nbsp;
            <button className="btn btn-secondary" onClick={this.clearForm}>Clear</button>
          </form>
          {this.renderTable()}
        </div>
        <div className="col-xl col-lg-3 col-md-2">&nbsp;</div>
      </div>
    );
  }
}

class FormInput extends React.Component {
  render() {
    return (
      <div className="form-group row">
        <label className="col-sm-3 col-form-label" htmlFor={this.props.name}>{this.props.label}</label>
        <div className="col-sm-9">
          <input type={this.props.type} value={this.props.value} onChange={this.props.onChange} name={this.props.name} id={this.props.name} className="form-control"/>
          <div className="invalid-feedback">{this.props.errors}</div>
        </div>
      </div>
    );
  }
}

class Player extends React.Component {
  render() {
    const player = this.props.player;
    return (
      <tr>
        <td>{player.lastName}, {player.firstName}</td>
        <td>{player.score}</td>
        <td>
          <a href={"#" + player.id} onClick={() => this.props.editPlayer(player)}>Edit</a>&nbsp;
          <a href={"#" + player.id} onClick={() => this.props.removePlayer(player.id)}>Delete</a>
        </td>
      </tr>
    );
  }
}

const players = [
  {id: 1, firstName: "John", lastName: "Smith", score: 30},
  {id: 2, firstName: "David", lastName: "Jones", score: 55},
  {id: 3, firstName: "Michael", lastName: "Johnson", score: 30},
  {id: 4, firstName: "Chris", lastName: "Lee", score: 30}
];

ReactDOM.render(
  <PlayersForm players={players}/>,
  document.getElementById('root')
);