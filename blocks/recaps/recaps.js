const RECAPS = [
  {
    game: 1,
    date: 'Sat, Apr 18',
    opponent: '905 Tedeschi Reds',
    result: 'W 12-1',
    resultClass: 'win',
    summary: `906 Grosskurth A's opened the scoring in the bottom of the first thanks to three singles. 906 Grosskurth A's first got on the board when Matthew singled, scoring one run.

906 Grosskurth A's added to their early lead in the bottom of the second inning after Connor walked, Sal walked, Conor singled to center field, and Sean walked, each scoring one run.

906 Grosskurth A's added one run in the third after Connor walked.

906 Grosskurth A's scored two runs in the bottom of the fifth on a home run to right field by CJ.

#30 took the loss for 905 Tedeschi Reds. The pitcher went four innings, surrendering 12 runs on seven hits, striking out 10 and walking 11.

CJ drove the middle of the lineup, leading 906 Grosskurth A's with two runs batted in. The shortstop went 2-for-2 on the day. CJ and Conor each collected two hits for 906 Grosskurth A's. Joshua led 906 Grosskurth A's with two walks. Overall, the team had a strong eye at the plate, tallying 11 walks for the game. Joshua, Brogan, Matthew, and Conor each stole multiple bases for 906 Grosskurth A's. 906 Grosskurth A's stole 11 bases in the game.

905 Tedeschi Reds's #24, the number nine hitter, led 905 Tedeschi Reds with two hits in two at bats. #19 stole two bases.

Next up for 906 Grosskurth A's is a game at NAA4-Kumon Learning-Sheron on Tuesday.`,
  },
  {
    game: 2,
    date: 'Tue, Apr 21',
    opponent: 'NAA4-Kumon Learning-Sheron',
    result: 'L 3-12',
    resultClass: 'loss',
    summary: `906 Grosskurth A's had trouble keeping up with NAA4-Kumon Learning-Sheron in a 12-3 loss on Tuesday at Browns Road.

NAA4-Kumon Learning-Sheron jumped out to the lead in the bottom of the first inning after #23 was struck by a pitch, driving in a run, #6 drew a walk, scoring one run, and #29 doubled, scoring two runs.

NAA4-Kumon Learning-Sheron extended their early lead with four runs in the bottom of the third thanks to RBI walks by #23, #6, #29, and #5.

#1 earned the win for NAA4-Kumon Learning-Sheron. The starting pitcher gave up two hits and three runs over four and two-thirds innings, striking out 10 and walking six. Sean stepped on the mound first for 906 Grosskurth A's. The starter gave up two hits and four runs over two-thirds of an inning, striking out two and walking three.

Matthew and Christian each collected one hit for 906 Grosskurth A's. Salvatore, Conor, and Christian each drove in one run for 906 Grosskurth A's. 906 Grosskurth A's had patience at the plate, accumulating six walks for the game. CJ and Brogan led the team with two walks each. CJ and Matthew each stole multiple bases for 906 Grosskurth A's. 906 Grosskurth A's stole seven bases in the game.

#29 led NAA4-Kumon Learning-Sheron with three runs batted in from the number eight spot in the lineup. #29 went 1-for-1 on the day. Leadoff hitter #42 led NAA4-Kumon Learning-Sheron with two hits in three at bats. NAA4-Kumon Learning-Sheron had patience at the plate, accumulating 13 walks for the game. #1, #6, and #5 led the team with two free passes each. #28 stole two bases.

906 Grosskurth A's play at home on Thursday against NAA3-La Vida Massage-DeMato in their next game.`,
  },
];

export default function decorate(block) {
  block.textContent = '';

  // Filter bar
  const filterBar = document.createElement('div');
  filterBar.className = 'recaps-filter';
  const allBtn = document.createElement('button');
  allBtn.className = 'recaps-filter-btn active';
  allBtn.textContent = 'All Games';
  allBtn.dataset.game = 'all';
  filterBar.append(allBtn);

  RECAPS.forEach((r) => {
    const btn = document.createElement('button');
    btn.className = 'recaps-filter-btn';
    btn.textContent = `Game ${r.game}`;
    btn.dataset.game = r.game;
    filterBar.append(btn);
  });

  // Recap cards
  const cardList = document.createElement('div');
  cardList.className = 'recaps-list';

  RECAPS.forEach((r) => {
    const card = document.createElement('div');
    card.className = 'recap-card';
    card.dataset.game = r.game;

    const paragraphs = r.summary.split('\n\n').map((p) => `<p>${p.trim()}</p>`).join('');

    card.innerHTML = `
      <div class="recap-header">
        <div class="recap-game-info">
          <span class="recap-game-num">Game ${r.game}</span>
          <span class="recap-date">${r.date}</span>
        </div>
        <div class="recap-matchup">
          <span class="recap-opponent">vs ${r.opponent}</span>
          <span class="recap-result ${r.resultClass}">${r.result}</span>
        </div>
      </div>
      <div class="recap-body">${paragraphs}</div>
    `;
    cardList.append(card);
  });

  block.append(filterBar, cardList);

  // Filter logic
  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.recaps-filter-btn');
    if (!btn) return;
    filterBar.querySelectorAll('.recaps-filter-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const game = btn.dataset.game;
    cardList.querySelectorAll('.recap-card').forEach((card) => {
      card.style.display = (game === 'all' || card.dataset.game === game) ? '' : 'none';
    });
  });
}
