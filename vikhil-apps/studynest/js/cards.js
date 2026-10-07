/* Flashcards with simple spaced repetition (Leitner boxes). Box 1 = every day, 2 = 3 days, 3 = 7 days. */
const GAP=[0,1,3,7];
let cards=Store.get('cards',null)||[
 {id:1,deck:'Biology',front:'Which organelle makes most of the cell\'s ATP?',back:'Mitochondria',box:1,due:dayKey()},
 {id:2,deck:'Physics',front:'SI unit of force?',back:'Newton (N)',box:1,due:dayKey()},
 {id:3,deck:'Maths',front:'Derivative of sin x?',back:'cos x',box:1,due:dayKey()}];
let queue=[],cur=null,flipped=false;
const save=()=>{Store.set('cards',cards);$('#cardCount').textContent=cards.length+' cards in '+new Set(cards.map(c=>c.deck)).size+' decks';if(window.refreshHome)refreshHome()};
const dueCards=()=>cards.filter(c=>c.due<=dayKey());
function nextCard(){cur=queue.shift();flipped=false;
 if(!cur){$('#flash').textContent='All done for today! 🎉';$('#knew').hidden=$('#missed').hidden=true;$('#startCards').hidden=false;markStudied();return}
 $('#flash').textContent=cur.front;$('#studyHead').textContent=cur.deck+' · '+(queue.length+1)+' left';$('#knew').hidden=$('#missed').hidden=false;$('#startCards').hidden=true}
$('#flash').onclick=()=>{if(!cur)return;flipped=!flipped;$('#flash').textContent=flipped?cur.back:cur.front};
$('#flash').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();$('#flash').click()}};
$('#startCards').onclick=()=>{queue=dueCards();if(!queue.length){$('#flash').textContent='No cards due. Come back tomorrow, or add more.';return}nextCard()};
function grade(ok){const c=cards.find(x=>x.id===cur.id);c.box=ok?Math.min(3,c.box+1):1;const d=new Date();d.setDate(d.getDate()+(ok?GAP[c.box]:0));c.due=dayKey(d);
 if(!ok)queue.push(c);save();nextCard()}
$('#knew').onclick=()=>grade(true);$('#missed').onclick=()=>grade(false);
$('#cardForm').onsubmit=e=>{e.preventDefault();cards.push({id:Date.now(),deck:$('#cDeck').value.trim(),front:$('#cFront').value.trim(),back:$('#cBack').value.trim(),box:1,due:dayKey()});$('#cFront').value=$('#cBack').value='';save()};
save();
