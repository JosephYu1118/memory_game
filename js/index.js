// ====================
//      DATABASE
// ==============================
var icons_data = [
  "far fa-grin-tongue", 
  "far fa-grin-tongue", 
  "far fa-meh-rolling-eyes", 
  "far fa-meh-rolling-eyes", 
  "fas fa-blind", 
  "fas fa-blind", 
  "fas fa-car-crash", 
  "fas fa-car-crash", 
  "far fa-sad-cry", 
  "far fa-sad-cry", 
  "fas fa-crow", 
  "fas fa-crow", 
  "fas fa-hippo", 
  "fas fa-hippo", 
  "fas fa-child", 
  "fas fa-child"
]

// ====================
//      CLASS_GameRule
// ==============================
var GameRule = function(){
  this.cards = []
  this.opened_cards = []
  this.moves = 0
  this.minutes = 0
  this.seconds = 0
}

GameRule.prototype.startGame = function(){
  $(".deck").html("")
  $(".modal").css("display", "none")
  this.getCards(icons_data)
  this.cards.forEach(card => card.classList.remove("open", "match", "disabled"))
  this.opened_cards = []
  this.moves = 0
  $(".moves").text(this.moves + " 步")
  this.minutes = 0
  this.seconds = 0
  $(".minutes").text(this.minutes + " 分")
  $(".seconds").text(this.seconds + " 秒")
  clearInterval(this.timer)
}

GameRule.prototype.getCards = function(cards_data){
  let current_cards = this.shuffle(cards_data)
  for(var i = 0; i < current_cards.length; i++){
    $(".deck").append(`
      <div class="card" type="${current_cards[i].split(' ')[1]}">
        <i class="${current_cards[i]}"></i>
      </div>
    `)
  }
  this.cards = [...$("[class ^= 'card']")]
  let _this = this
  this.cards.forEach(card => {
    card.addEventListener("click", function(){
      $(this).toggleClass("open")
      $(this).toggleClass("disabled")
    })
    card.addEventListener("click", function(){
      _this.openCard(this)
    })
    card.addEventListener("click", function(){
      _this.showMessage()
    })
  })
}

GameRule.prototype.shuffle = function(array){
  let current_index = array.length, 
      temporary_value, 
      random_index
  while(current_index !== 0){
    random_index = Math.floor(Math.random() * current_index)
    current_index -= 1
    temporary_value = array[current_index]
    array[current_index] = array[random_index]
    array[random_index] = temporary_value
  }
  return array
}

GameRule.prototype.openCard = function(card){
  this.opened_cards.push(card)
  if(this.opened_cards.length == 1 && this.moves == 0){
    this.minutes = 0
    this.seconds = 0
    this.startTime()
  }else if(this.opened_cards.length === 2){
    this.moves++
    $(".moves").text(this.moves + " 步")
    if($(this.opened_cards[0]).attr("type") === $(this.opened_cards[1]).attr("type")){
      this.matching()
    }else{
      this.notMatching()
    }
  }
}

GameRule.prototype.startTime = function(){
  this.timer = setInterval(() => {
    $(".minutes").text(this.minutes + " 分")
    $(".seconds").text(this.seconds + " 秒")
    this.seconds++
    if(this.seconds == 60){
      this.minutes++
      this.seconds = 0
    }
  }, 1000)
}

GameRule.prototype.matching = function(){
  this.opened_cards.forEach(card => {
    card.classList.add("match", "disabled")
    card.classList.remove("open")
  })
  this.opened_cards = []
}

GameRule.prototype.notMatching = function(){
  this.opened_cards.forEach(card => card.classList.add("not_match"))
  this.cards.forEach(card => card.classList.add("disabled"))
  setTimeout(() =>{
    this.opened_cards.forEach(card => card.classList.remove("open", "not_match"))
    this.cards.forEach(card => {
      if($(card).hasClass("match")){
      }else{
        card.classList.remove("disabled")
      }
    })
    this.opened_cards = []
  }, 500)
}

GameRule.prototype.showMessage = function(){
  if(this.cards.every(card => $(card).hasClass("match"))){
    clearInterval(this.timer)
    $(".modal").css("display", "block")
    $(".time_taken").text("總共花了: " + $(".minutes").text() + $(".seconds").text())
    $(".moves_taken").text("總共動了: " + this.moves + " 步")
  }
}

// ====================
//      OBJECT_game_rule
// ==============================
var game_rule = new GameRule()
game_rule.startGame()