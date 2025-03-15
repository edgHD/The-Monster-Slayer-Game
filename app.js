// Function to generate a random value between min (inclusive) and max (exclusive)
const randomValue = (min, max) => Math.floor(Math.random() * (max - min) + min);

// Create the Vue application
const app = Vue.createApp({
  // Reactive data properties
  data() {
    return {
      playerHealth: 100, // Player's health, starts at 100
      monsterHealth: 100, // Monster's health, starts at 100
      currentRound: 0, // Tracks the current game round
      specialAttackWaitTime: 3, // Wait time for using special attack
      isSurrendered: false, // Tracks if the player has surrendered
      winner: null, // The winner of the game (null initially)
      logMessages: [], // Array for storing battle logs
    };
  },
  // Computed properties for dynamic calculations
  computed: {
    // Returns the health bar's width for either the player or monster
    healthBar() {
      return (entity) => {
        return { width: this[`${entity}Health`] + "%" };
      };
    },
    // Determines if the special attack can currently be used
    mayUseSpecialAttack() {
      return this.specialAttackWaitTime < 3;
    },
    // Checks if the player's health is full to disable healing
    fullHealthNoHeal() {
      return this.playerHealth === 100;
    },
  },
  // Watchers to monitor changes in specific data properties
  watch: {
    // Reacts to changes in the player's health and determines the game outcome
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "monster";
      }
    },
    // Reacts to changes in the monster's health and determines the game outcome
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "player";
      }
    },
    // Reacts when the player surrenders, setting the winner as the monster
    isSurrendered(value) {
      if (value) {
        this.winner = "monster";
      }
    },
  },
  // Methods for various game actions
  methods: {
    // Handles the player's regular attack on the monster
    attackMonster() {
      this.currentRound++;
      this.specialAttackWaitTime++;
      const attackValue = randomValue(5, 12);
      this.monsterHealth = Math.max(this.monsterHealth - attackValue, 0);
      this.addLogMessage("player", "attack", attackValue);
      this.attackPlayer();
    },
    // Handles the player's special attack on the monster
    specialAttackMonster() {
      this.currentRound++;
      const attackValue = randomValue(10, 25);
      this.monsterHealth = Math.max(this.monsterHealth - attackValue, 0);
      this.addLogMessage("player", "special-attack", attackValue);
      this.specialAttackWaitTime = 0;
      this.attackPlayer();
    },
    // Handles the monster's attack on the player
    attackPlayer() {
      const attackValue = randomValue(8, 15);
      this.playerHealth = Math.max(this.playerHealth - attackValue, 0);
      this.addLogMessage("monster", "attack", attackValue);
    },
    // Handles the player's healing action
    healPlayer() {
      this.currentRound++;
      const healValue = randomValue(20, 25);
      this.playerHealth = Math.min(this.playerHealth + healValue, 100);
      this.addLogMessage("player", "heal", healValue);
      this.attackPlayer();
    },
    // Adds a new message to the battle log
    addLogMessage(who, what, value) {
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
    // Resets the game state to start a new game
    restartGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.currentRound = 0;
      this.specialAttackWaitTime = 3;
      this.isSurrendered = false;
      this.winner = null;
      this.logMessages = [];
    },
  },
});
// Mount the Vue app to the DOM
app.mount("#game");
