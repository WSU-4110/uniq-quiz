// Subject Class
class LobbyState {
    constructor(){
        this.observers = [];
        this.state = {
            joinCode: "",
            isHost: false,
            canStart: false,
            lobbyMessage: "",
            messages: [],
            players: []
        };
        
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notifyObservers() {
        this.observers.forEach(observer => observer.update(this.state));
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notifyObservers();
    }
}

//Not a singleton: let components call as needed. 
export default LobbyState;