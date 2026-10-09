/* ============================================================
 * 课程数据：沪教版（牛津上海版 Oxford Shanghai Edition）一年级 ~ 九年级
 * 结构：年级(grade) → 单元(unit，单元名含 Module 标注) → 关卡阶段(stage)
 * 每一年级把"上册 + 下册"合并；单元名格式：M1 · Greetings｜问候
 * 每单元固定 4 个闯关阶段：学一学 / 跟我读 / 听音选词 / 闯关测验
 * 词表为对应沪教版单元的核心词汇（可继续增补）。
 * 末尾自动为单元生成唯一 id（grade.id + '-u' + 序号）。
 * ============================================================ */

function stdStages() {
  return [
    { type: 'learn',  title: '学一学',   icon: '📚' },
    { type: 'speak',  title: '跟我读',   icon: '🎤' },
    { type: 'listen', title: '听音选词', icon: '👂' },
    { type: 'quiz',   title: '闯关测验', icon: '🏆' }
  ];
}

// 单词构造
function w(en, zh, emoji) { return { en: en, zh: zh, emoji: emoji }; }
// 单元构造：m=模块简标, en=英文单元名, zh=中文, emoji=图标, words=词表, sentences=句子(可选)
function U(m, en, zh, emoji, words, sentences) {
  return {
    name: m + ' · ' + en + '｜' + zh,
    emoji: emoji,
    words: words,
    sentences: sentences || [],
    stages: stdStages()
  };
}

/* ---------------- 一年级上 (1A) ---------------- */
const U1A = [
  U('M1', 'Greetings', '问候', '👋', [
    w('hello', '你好', '👋'), w('hi', '嗨', '🙋'), w('goodbye', '再见', '🚶'),
    w('good morning', '早上好', '🌅'), w('good afternoon', '下午好', '☀️'),
    w('good evening', '晚上好', '🌆'), w('good night', '晚安', '🌙'), w('nice', '高兴的', '😊')
  ], ['Hello, I am a cat.', 'Good morning, teacher.']),
  U('M1', 'My classmates', '同学', '🎒', [
    w('book', '书', '📕'), w('ruler', '尺子', '📏'), w('pencil', '铅笔', '✏️'),
    w('rubber', '橡皮', '🩹'), w('bag', '书包', '🎒'), w('give', '给', '🤲'),
    w('please', '请', '🙏'), w('thank you', '谢谢', '🙏')
  ], ['This is my book.', 'Thank you, teacher.']),
  U('M1', 'My face', '我的脸', '😊', [
    w('eye', '眼睛', '👁️'), w('ear', '耳朵', '👂'), w('nose', '鼻子', '👃'),
    w('mouth', '嘴巴', '👄'), w('face', '脸', '😊'), w('touch', '摸', '✋')
  ], ['Touch your nose.', 'This is my face.']),
  U('M2', 'My abilities', '我的能力', '💪', [
    w('run', '跑', '🏃'), w('jump', '跳', '⬆️'), w('sing', '唱', '🎤'),
    w('dance', '跳舞', '💃'), w('read', '读', '📖'), w('write', '写', '✍️'),
    w('draw', '画', '🎨'), w('can', '会', '✅')
  ], ['I can run.', 'I can draw.']),
  U('M2', 'My family', '我的家庭', '👨‍👩‍👧', [
    w('father', '爸爸', '👨'), w('mother', '妈妈', '👩'), w('grandfather', '爷爷', '👴'),
    w('grandmother', '奶奶', '👵'), w('brother', '哥哥', '👦'), w('sister', '妹妹', '👧'),
    w('me', '我', '🙂')
  ], ['This is my father.', 'I love my family.']),
  U('M2', 'My friends', '我的朋友', '🤝', [
    w('friend', '朋友', '🤝'), w('fat', '胖的', '🐻'), w('thin', '瘦的', '🐱'),
    w('tall', '高的', '🦒'), w('short', '矮的', '🐰'), w('he', '他', '👦'),
    w('she', '她', '👧'), w('big', '大的', '🐘')
  ], ['He is my friend.', 'She is tall.']),
  U('M3', 'In the classroom', '教室', '🏫', [
    w('classroom', '教室', '🏫'), w('desk', '书桌', '🪑'), w('chair', '椅子', '🪑'),
    w('blackboard', '黑板', '🟫'), w('door', '门', '🚪'), w('window', '窗户', '🪟'),
    w('open', '打开', '🔓'), w('close', '关上', '🔒')
  ], ['Open the door.', 'Clean the window.']),
  U('M3', 'In the fruit shop', '水果店', '🍎', [
    w('apple', '苹果', '🍎'), w('banana', '香蕉', '🍌'), w('orange', '橘子', '🍊'),
    w('pear', '梨', '🍐'), w('peach', '桃', '🍑'), w('grape', '葡萄', '🍇'),
    w('shop', '商店', '🏪'), w('buy', '买', '🛒')
  ], ['I like apples.', 'A red apple, please.']),
  U('M3', 'In the restaurant', '餐厅', '🍽️', [
    w('hamburger', '汉堡', '🍔'), w('pizza', '披萨', '🍕'), w('cake', '蛋糕', '🍰'),
    w('egg', '蛋', '🥚'), w('noodles', '面条', '🍜'), w('rice', '米饭', '🍚'),
    w('eat', '吃', '😋'), w('drink', '喝', '🥤')
  ], ['I eat rice.', 'A cake for you.']),
  U('M4', 'On the farm', '农场', '🚜', [
    w('cow', '奶牛', '🐄'), w('pig', '猪', '🐖'), w('duck', '鸭', '🦆'),
    w('chicken', '鸡', '🐔'), w('sheep', '羊', '🐑'), w('horse', '马', '🐴'),
    w('farm', '农场', '🚜'), w('farmer', '农民', '👨‍🌾')
  ], ['The cow is big.', 'A duck on the farm.']),
  U('M4', 'In the zoo', '动物园', '🦁', [
    w('lion', '狮子', '🦁'), w('tiger', '老虎', '🐯'), w('elephant', '大象', '🐘'),
    w('monkey', '猴子', '🐵'), w('panda', '熊猫', '🐼'), w('bear', '熊', '🐻'),
    w('zoo', '动物园', '🦁'), w('animal', '动物', '🐾')
  ], ['I like the panda.', 'The tiger is big.']),
  U('M4', 'In the park', '公园', '🌳', [
    w('tree', '树', '🌳'), w('flower', '花', '🌸'), w('grass', '草', '🌿'),
    w('bird', '鸟', '🐦'), w('bee', '蜜蜂', '🐝'), w('butterfly', '蝴蝶', '🦋'),
    w('park', '公园', '🌳'), w('sun', '太阳', '☀️')
  ], ['A red flower.', 'The bird is small.'])
];

/* ---------------- 一年级下 (1B) ---------------- */
const U1B = [
  U('M1', 'Look and see', '看', '👀', [
    w('see', '看', '👀'), w('red', '红色', '🔴'), w('blue', '蓝色', '🔵'),
    w('yellow', '黄色', '🟡'), w('green', '绿色', '🟢'), w('colour', '颜色', '🎨'),
    w('flower', '花', '🌸'), w('sky', '天空', '🌌')
  ], ['I see red.', 'The sky is blue.']),
  U('M1', 'Listen and hear', '听', '👂', [
    w('hear', '听', '👂'), w('sound', '声音', '🔊'), w('bell', '铃', '🔔'),
    w('car', '汽车', '🚗'), w('bus', '公交', '🚌'), w('cat', '猫', '🐱'),
    w('dog', '狗', '🐶'), w('loud', '响的', '📢')
  ], ['I hear a bell.', 'The dog is loud.']),
  U('M1', 'Taste and smell', '尝和闻', '👅', [
    w('taste', '尝', '👅'), w('smell', '闻', '👃'), w('sweet', '甜', '🍬'),
    w('sour', '酸', '🍋'), w('yummy', '好吃', '😋'), w('yucky', '难吃', '🤢'),
    w('nose', '鼻子', '👃'), w('tongue', '舌头', '👅')
  ], ['The apple is sweet.', 'Yucky, no.']),
  U('M2', 'Toys I like', '玩具', '🧸', [
    w('toy', '玩具', '🧸'), w('ball', '球', '⚽'), w('doll', '娃娃', '🪆'),
    w('kite', '风筝', '🪁'), w('bicycle', '自行车', '🚲'), w('car', '车', '🚗'),
    w('bear', '熊', '🐻'), w('like', '喜欢', '❤️')
  ], ['I like the ball.', 'A red kite.']),
  U('M2', 'Food I like', '食物', '🍎', [
    w('meat', '肉', '🍖'), w('chicken', '鸡', '🍗'), w('fish', '鱼', '🐟'),
    w('rice', '米饭', '🍚'), w('soup', '汤', '🥣'), w('bread', '面包', '🍞'),
    w('yum', '好吃', '😋'), w('hungry', '饿', '🍽️')
  ], ['I like chicken.', 'Yum, rice.']),
  U('M2', 'Drinks I like', '饮料', '🥤', [
    w('water', '水', '💧'), w('milk', '牛奶', '🥛'), w('juice', '果汁', '🧃'),
    w('tea', '茶', '🍵'), w('cola', '可乐', '🥤'), w('coffee', '咖啡', '☕'),
    w('thirsty', '渴', '🥤'), w('cup', '杯子', '🥤')
  ], ['I drink milk.', 'Water, please.']),
  U('M3', 'Seasons', '季节', '🍂', [
    w('spring', '春', '🌸'), w('summer', '夏', '☀️'), w('autumn', '秋', '🍂'),
    w('winter', '冬', '❄️'), w('warm', '暖的', '🌞'), w('hot', '热的', '🔥'),
    w('cool', '凉的', '🍃'), w('cold', '冷的', '🥶')
  ], ['Spring is warm.', 'Winter is cold.']),
  U('M3', 'Weather', '天气', '☁️', [
    w('sunny', '晴', '☀️'), w('rainy', '雨', '🌧️'), w('cloudy', '云', '☁️'),
    w('windy', '风', '🌬️'), w('snowy', '雪', '❄️'), w('weather', '天气', '🌤️'),
    w('umbrella', '伞', '☂️'), w('raincoat', '雨衣', '🧥')
  ], ['It is sunny.', 'Rainy day.']),
  U('M3', 'Clothes', '衣服', '👕', [
    w('shirt', '衬衫', '👔'), w('dress', '连衣裙', '👗'), w('trousers', '裤子', '👖'),
    w('shoes', '鞋', '👟'), w('hat', '帽子', '🎩'), w('coat', '外套', '🧥'),
    w('wear', '穿', '👕'), w('sock', '袜子', '🧦')
  ], ['I wear a red shirt.', 'A yellow dress.']),
  U('M4', 'Activities', '活动', '🏃', [
    w('play', '玩', '⚽'), w('swim', '游泳', '🏊'), w('skip', '跳绳', '🪢'),
    w('ride', '骑', '🚲'), w('fly', '飞', '✈️'), w('walk', '走', '🚶'),
    w('sport', '运动', '🏅'), w('fun', '有趣', '😄')
  ], ['I can swim.', 'Let us play.']),
  U('M4', "New Year's Day", '新年', '🎆', [
    w('New Year', '新年', '🎆'), w('gift', '礼物', '🎁'), w('card', '卡片', '🎴'),
    w('party', '聚会', '🎉'), w('happy', '快乐', '😄'), w('firework', '烟花', '🎆'),
    w('red', '红色', '🔴'), w('celebrate', '庆祝', '🎊')
  ], ['Happy New Year!', 'A red gift.']),
  U('M4', 'Story time', '故事时间', '📖', [
    w('story', '故事', '📖'), w('book', '书', '📕'), w('read', '读', '📖'),
    w('king', '国王', '👑'), w('wolf', '狼', '🐺'), w('sheep', '羊', '🐑'),
    w('end', '结束', '🔚'), w('favourite', '最爱', '⭐')
  ], ['I read a book.', 'The story is fun.'])
];

/* ---------------- 二年级上 (2A) ---------------- */
const U2A = [
  U('M1', 'Hello', '你好', '👋', [
    w('hello', '你好', '👋'), w('good morning', '早上好', '🌅'), w('good afternoon', '下午好', '☀️'),
    w('good evening', '晚上好', '🌆'), w('how are you', '你好吗', '🙂'), w('fine', '好的', '👍'),
    w('thank you', '谢谢', '🙏'), w('goodbye', '再见', '🚶')
  ], ['How are you?', 'I am fine.']),
  U('M1', "I'm Danny", '我是丹尼', '🧒', [
    w('name', '名字', '📛'), w('boy', '男孩', '👦'), w('girl', '女孩', '👧'),
    w('I am', '我是', '🙋'), w('tall', '高', '🦒'), w('short', '矮', '🐰'),
    w('fat', '胖', '🐻'), w('thin', '瘦', '🐱')
  ], ["I am Danny.", 'I am a boy.']),
  U('M1', 'A new classmate', '新同学', '🤝', [
    w('classmate', '同学', '🧑‍🏫'), w('new', '新的', '✨'), w('welcome', '欢迎', '🤗'),
    w('he', '他', '👦'), w('she', '她', '👧'), w('friend', '朋友', '🤝'),
    w('classroom', '教室', '🏫'), w('nice', '好的', '😊')
  ], ['Welcome!', 'He is my friend.']),
  U('M2', 'I can swim', '我会游泳', '🏊', [
    w('swim', '游泳', '🏊'), w('skate', '滑冰', '⛸️'), w('ride', '骑', '🚲'),
    w('fly', '飞', '✈️'), w('run', '跑', '🏃'), w('jump', '跳', '⬆️'),
    w('can', '会', '✅'), w('cannot', '不会', '❌')
  ], ['I can swim.', 'I cannot fly.']),
  U('M2', "That's my family", '我的家庭', '👨‍👩‍👧', [
    w('father', '爸爸', '👨'), w('mother', '妈妈', '👩'), w('grandfather', '爷爷', '👴'),
    w('grandmother', '奶奶', '👵'), w('uncle', '叔叔', '👨'), w('aunt', '阿姨', '👩'),
    w('cousin', '表亲', '🧒'), w('family', '家庭', '🏠')
  ], ["That is my father.", 'I love my family.']),
  U('M2', 'My hair is short', '我的头发短', '💇', [
    w('hair', '头发', '💇'), w('head', '头', '🙆'), w('long', '长', '📏'),
    w('short', '短', '✂️'), w('eye', '眼睛', '👁️'), w('ear', '耳朵', '👂'),
    w('face', '脸', '😊'), w('small', '小', '🔘')
  ], ['My hair is short.', 'A small head.']),
  U('M3', "In the children's garden", '儿童乐园', '🎡', [
    w('garden', '乐园', '🎡'), w('slide', '滑梯', '🛝'), w('swing', '秋千', '🪢'),
    w('ball', '球', '⚽'), w('see', '看', '👀'), w('play', '玩', '⚽'),
    w('happy', '快乐', '😄'), w('children', '孩子', '🧒')
  ], ['I play in the garden.', 'The slide is fun.']),
  U('M3', 'In my room', '我的房间', '🛏️', [
    w('room', '房间', '🛏️'), w('bed', '床', '🛏️'), w('table', '桌子', '🪑'),
    w('chair', '椅子', '🪑'), w('box', '盒子', '📦'), w('bag', '书包', '🎒'),
    w('book', '书', '📕'), w('toy', '玩具', '🧸')
  ], ['This is my room.', 'A big bed.']),
  U('M3', 'In the kitchen', '厨房', '🍳', [
    w('kitchen', '厨房', '🍳'), w('plate', '盘子', '🍽️'), w('bowl', '碗', '🥣'),
    w('spoon', '勺子', '🥄'), w('fork', '叉子', '🍴'), w('cup', '杯子', '🥤'),
    w('cook', '煮', '🍳'), w('eat', '吃', '😋')
  ], ['In the kitchen.', 'A red cup.']),
  U('M4', 'In the sky', '天空', '🌌', [
    w('sun', '太阳', '☀️'), w('moon', '月亮', '🌙'), w('star', '星星', '⭐'),
    w('sky', '天空', '🌌'), w('cloud', '云', '☁️'), w('rain', '雨', '🌧️'),
    w('wind', '风', '🌬️'), w('bright', '亮的', '✨')
  ], ['The sun is bright.', 'A star in the sky.']),
  U('M4', 'In the forest', '森林', '🌲', [
    w('forest', '森林', '🌲'), w('tree', '树', '🌳'), w('fox', '狐狸', '🦊'),
    w('rabbit', '兔子', '🐰'), w('deer', '鹿', '🦌'), w('bird', '鸟', '🐦'),
    w('leaf', '叶子', '🍃'), w('green', '绿色', '🟢')
  ], ['A fox in the forest.', 'Green leaves.']),
  U('M4', 'In the street', '街道', '🛣️', [
    w('street', '街道', '🛣️'), w('car', '车', '🚗'), w('bus', '公交', '🚌'),
    w('taxi', '出租', '🚕'), w('bike', '自行车', '🚲'), w('stop', '停', '🛑'),
    w('go', '走', '🚶'), w('light', '灯', '💡')
  ], ['A red car.', 'Stop at the light.'])
];

/* ---------------- 二年级下 (2B) ---------------- */
const U2B = [
  U('M1', 'What can you see?', '你能看见什么', '👀', [
    w('see', '看', '👀'), w('look', '看', '👀'), w('picture', '图画', '🖼️'),
    w('animal', '动物', '🐾'), w('red', '红色', '🔴'), w('blue', '蓝色', '🔵'),
    w('big', '大', '🐘'), w('small', '小', '🔘')
  ], ['I see a red ball.', 'A small animal.']),
  U('M1', 'Touch and feel', '摸和感觉', '✋', [
    w('touch', '摸', '✋'), w('feel', '感觉', '💭'), w('soft', '软的', '🧸'),
    w('hard', '硬的', '🪨'), w('smooth', '光滑', '✨'), w('rough', '粗糙', '🪵'),
    w('hot', '热', '🔥'), w('cold', '冷', '🥶')
  ], ['It is soft.', 'Touch the ball.']),
  U('M1', 'What can you hear?', '你能听见什么', '👂', [
    w('hear', '听', '👂'), w('noise', '噪音', '🔊'), w('bell', '铃', '🔔'),
    w('phone', '电话', '📞'), w('music', '音乐', '🎵'), w('quiet', '安静', '🤫'),
    w('loud', '响', '📢'), w('sound', '声音', '🔊')
  ], ['I hear a bell.', 'The music is loud.']),
  U('M2', 'Things I like doing', '喜欢做的事', '🎨', [
    w('draw', '画', '🎨'), w('paint', '涂', '🖌️'), w('sing', '唱', '🎤'),
    w('dance', '跳', '💃'), w('read', '读', '📖'), w('play', '玩', '⚽'),
    w('like', '喜欢', '❤️'), w('fun', '有趣', '😄')
  ], ['I like drawing.', 'Sing a song.']),
  U('M2', 'My favourite food', '最爱的食物', '🍔', [
    w('hamburger', '汉堡', '🍔'), w('pizza', '披萨', '🍕'), w('noodles', '面条', '🍜'),
    w('dumpling', '饺子', '🥟'), w('rice', '米饭', '🍚'), w('vegetable', '蔬菜', '🥦'),
    w('yummy', '好吃', '😋'), w('favourite', '最爱', '⭐')
  ], ['Pizza is yummy.', 'My favourite food.']),
  U('M2', 'Animals I like', '喜欢的动物', '🐾', [
    w('cat', '猫', '🐱'), w('dog', '狗', '🐶'), w('rabbit', '兔', '🐰'),
    w('fish', '鱼', '🐟'), w('bird', '鸟', '🐦'), w('turtle', '乌龟', '🐢'),
    w('cute', '可爱', '🥰'), w('pet', '宠物', '🐾')
  ], ['I like cats.', 'A cute rabbit.']),
  U('M3', 'The four seasons', '四季', '🍂', [
    w('spring', '春', '🌸'), w('summer', '夏', '☀️'), w('autumn', '秋', '🍂'),
    w('winter', '冬', '❄️'), w('plant', '种', '🌱'), w('grow', '长', '🌿'),
    w('warm', '暖', '🌞'), w('cold', '冷', '🥶')
  ], ['Spring is warm.', 'I plant a tree.']),
  U('M3', 'Rules', '规则', '📏', [
    w('rule', '规则', '📏'), w('stop', '停', '🛑'), w('wait', '等', '⏳'),
    w('go', '走', '🚶'), w('red', '红', '🔴'), w('green', '绿', '🟢'),
    w('quiet', '安静', '🤫'), w('line', '队伍', '🚶')
  ], ['Stop at red.', 'Wait in line.']),
  U('M3', 'My clothes', '我的衣服', '👕', [
    w('shirt', '衬衫', '👔'), w('T-shirt', 'T恤', '👕'), w('dress', '连衣裙', '👗'),
    w('shorts', '短裤', '🩳'), w('shoes', '鞋', '👟'), w('socks', '袜子', '🧦'),
    w('wash', '洗', '🧼'), w('wear', '穿', '👕')
  ], ['I wear a T-shirt.', 'Wash your socks.']),
  U('M4', 'Activities', '活动', '🏃', [
    w('run', '跑', '🏃'), w('jump', '跳', '⬆️'), w('hop', '单脚跳', '🦘'),
    w('walk', '走', '🚶'), w('skip', '跳绳', '🪢'), w('climb', '爬', '🧗'),
    w('exercise', '运动', '🏋️'), w('healthy', '健康', '💪')
  ], ['I can hop.', 'Exercise is fun.']),
  U('M4', "Mother's Day", '母亲节', '💐', [
    w('mother', '妈妈', '👩'), w('flower', '花', '🌸'), w('card', '卡片', '🎴'),
    w('love', '爱', '❤️'), w('sweet', '甜', '🍬'), w('thank you', '谢谢', '🙏'),
    w('gift', '礼物', '🎁'), w('happy', '快乐', '😄')
  ], ['I love you, Mom.', 'A flower for you.']),
  U('M4', 'Story time', '故事时间', '📖', [
    w('story', '故事', '📖'), w('prince', '王子', '🤴'), w('princess', '公主', '👸'),
    w('dragon', '龙', '🐉'), w('magic', '魔法', '✨'), w('brave', '勇敢', '🦸'),
    w('end', '结束', '🔚'), w('read', '读', '📖')
  ], ['A brave prince.', 'Read the story.'])
];

/* ---------------- 三年级（上下册合并） ---------------- */
const U3 = [
  U('M1', 'How are you?', '你好吗', '🤝', [
    w('hello', '你好', '👋'), w('how are you', '你好吗', '🙂'), w('fine', '好', '👍'),
    w('good', '好', '⭐'), w('thank you', '谢谢', '🙏'), w('nice', '高兴', '😊'),
    w('meet', '遇见', '🤝'), w('too', '也', '➕')
  ]),
  U('M1', "What's your name?", '你叫什么名字', '📛', [
    w('name', '名字', '📛'), w('I am', '我是', '🙋'), w('what', '什么', '❓'),
    w('your', '你的', '🫵'), w('my', '我的', '🙆'), w('boy', '男孩', '👦'),
    w('girl', '女孩', '👧'), w('call', '称呼', '📞')
  ]),
  U('M1', 'How old are you?', '你几岁', '🎂', [
    w('old', '岁', '🎂'), w('how old', '几岁', '❓'), w('one', '一', '1️⃣'),
    w('five', '五', '5️⃣'), w('ten', '十', '🔟'), w('year', '年', '📅'),
    w('birthday', '生日', '🎂'), w('age', '年龄', '🔢')
  ]),
  U('M2', 'My friends', '我的朋友', '🤝', [
    w('friend', '朋友', '🤝'), w('good', '好的', '⭐'), w('kind', '善良', '😇'),
    w('helpful', '有帮助', '🤝'), w('tall', '高', '🦒'), w('short', '矮', '🐰'),
    w('boy', '男孩', '👦'), w('girl', '女孩', '👧')
  ]),
  U('M2', 'My family', '我的家庭', '👨‍👩‍👧', [
    w('father', '爸爸', '👨'), w('mother', '妈妈', '👩'), w('brother', '兄弟', '👦'),
    w('sister', '姐妹', '👧'), w('grandfather', '爷爷', '👴'), w('grandmother', '奶奶', '👵'),
    w('family', '家庭', '🏠'), w('love', '爱', '❤️')
  ]),
  U('M2', 'About me', '关于我', '🙋', [
    w('I', '我', '🙋'), w('like', '喜欢', '❤️'), w('can', '会', '✅'),
    w('have', '有', '🎁'), w('small', '小', '🔘'), w('big', '大', '🐘'),
    w('happy', '快乐', '😄'), w('school', '学校', '🏫')
  ]),
  U('M3', 'My school', '我的学校', '🏫', [
    w('school', '学校', '🏫'), w('classroom', '教室', '🏫'), w('library', '图书馆', '📚'),
    w('playground', '操场', '🏟️'), w('teacher', '老师', '👩‍🏫'), w('student', '学生', '🧑‍🎓'),
    w('learn', '学', '📖'), w('play', '玩', '⚽')
  ]),
  U('M3', 'Shopping', '购物', '🛒', [
    w('shop', '商店', '🏪'), w('buy', '买', '🛒'), w('sell', '卖', '💰'),
    w('apple', '苹果', '🍎'), w('toy', '玩具', '🧸'), w('book', '书', '📕'),
    w('money', '钱', '💰'), w('how much', '多少', '❓')
  ]),
  U('M3', 'In the park', '在公园', '🌳', [
    w('park', '公园', '🌳'), w('tree', '树', '🌳'), w('flower', '花', '🌸'),
    w('lake', '湖', '💧'), w('boat', '船', '⛵'), w('bird', '鸟', '🐦'),
    w('walk', '走', '🚶'), w('ride', '骑', '🚲')
  ]),
  U('M4', 'Insects', '昆虫', '🐛', [
    w('insect', '昆虫', '🐛'), w('bee', '蜜蜂', '🐝'), w('butterfly', '蝴蝶', '🦋'),
    w('ant', '蚂蚁', '🐜'), w('fly', '苍蝇', '🪰'), w('ladybird', '瓢虫', '🐞'),
    w('wing', '翅膀', '🦋'), w('small', '小', '🔘')
  ]),
  U('M4', 'On the farm', '在农场', '🚜', [
    w('farm', '农场', '🚜'), w('cow', '奶牛', '🐄'), w('pig', '猪', '🐖'),
    w('sheep', '羊', '🐑'), w('horse', '马', '🐴'), w('duck', '鸭', '🦆'),
    w('chicken', '鸡', '🐔'), w('farmer', '农民', '👨‍🌾')
  ]),
  U('M4', 'Plants', '植物', '🌱', [
    w('plant', '植物', '🌱'), w('tree', '树', '🌳'), w('flower', '花', '🌸'),
    w('leaf', '叶子', '🍃'), w('root', '根', '🌿'), w('water', '水', '💧'),
    w('grow', '生长', '🌿'), w('green', '绿色', '🟢')
  ]),
  U('M1', 'Seeing and hearing', '看和听', '👀', [
    w('see', '看', '👀'), w('hear', '听', '👂'), w('eye', '眼睛', '👁️'),
    w('ear', '耳朵', '👂'), w('look', '看', '👀'), w('listen', '听', '👂'),
    w('sound', '声音', '🔊'), w('colour', '颜色', '🎨')
  ]),
  U('M1', 'Touching and feeling', '摸和感觉', '✋', [
    w('touch', '摸', '✋'), w('feel', '感觉', '💭'), w('hand', '手', '✋'),
    w('soft', '软', '🧸'), w('hard', '硬', '🪨'), w('hot', '热', '🔥'),
    w('cold', '冷', '🥶'), w('warm', '暖', '🌞')
  ]),
  U('M1', 'Tasting and smelling', '尝和闻', '👅', [
    w('taste', '尝', '👅'), w('smell', '闻', '👃'), w('tongue', '舌头', '👅'),
    w('nose', '鼻子', '👃'), w('sweet', '甜', '🍬'), w('sour', '酸', '🍋'),
    w('yummy', '好吃', '😋'), w('bad', '坏', '🤢')
  ]),
  U('M2', 'Animals', '动物', '🐾', [
    w('cat', '猫', '🐱'), w('dog', '狗', '🐶'), w('rabbit', '兔', '🐰'),
    w('elephant', '大象', '🐘'), w('tiger', '老虎', '🐯'), w('panda', '熊猫', '🐼'),
    w('monkey', '猴子', '🐵'), w('cute', '可爱', '🥰')
  ]),
  U('M2', 'Toys', '玩具', '🧸', [
    w('toy', '玩具', '🧸'), w('ball', '球', '⚽'), w('doll', '娃娃', '🪆'),
    w('kite', '风筝', '🪁'), w('car', '车', '🚗'), w('robot', '机器人', '🤖'),
    w('block', '积木', '🧱'), w('fun', '有趣', '😄')
  ]),
  U('M2', 'Clothes', '衣服', '👕', [
    w('shirt', '衬衫', '👔'), w('dress', '连衣裙', '👗'), w('coat', '外套', '🧥'),
    w('hat', '帽子', '🎩'), w('shoe', '鞋', '👟'), w('sock', '袜子', '🧦'),
    w('wear', '穿', '👕'), w('new', '新', '✨')
  ]),
  U('M3', 'Shapes', '形状', '🔷', [
    w('circle', '圆', '⚪'), w('square', '方', '⬛'), w('triangle', '三角', '🔺'),
    w('star', '星', '⭐'), w('rectangle', '长方', '▫️'), w('line', '线', '➖'),
    w('red', '红', '🔴'), w('blue', '蓝', '🔵')
  ]),
  U('M3', 'Colours', '颜色', '🎨', [
    w('red', '红', '🔴'), w('blue', '蓝', '🔵'), w('yellow', '黄', '🟡'),
    w('green', '绿', '🟢'), w('orange', '橙', '🟠'), w('purple', '紫', '🟣'),
    w('black', '黑', '⚫'), w('white', '白', '⚪')
  ]),
  U('M3', 'Seasons', '季节', '🍂', [
    w('spring', '春', '🌸'), w('summer', '夏', '☀️'), w('autumn', '秋', '🍂'),
    w('winter', '冬', '❄️'), w('warm', '暖', '🌞'), w('hot', '热', '🔥'),
    w('cool', '凉', '🍃'), w('cold', '冷', '🥶')
  ]),
  U('M4', 'My body', '我的身体', '💪', [
    w('head', '头', '🙆'), w('eye', '眼睛', '👁️'), w('ear', '耳朵', '👂'),
    w('nose', '鼻子', '👃'), w('mouth', '嘴', '👄'), w('hand', '手', '✋'),
    w('foot', '脚', '🦶'), w('body', '身体', '💪')
  ]),
  U('M4', "Children's Day", '儿童节', '🎉', [
    w('children', '孩子', '🧒'), w('day', '天', '📅'), w('gift', '礼物', '🎁'),
    w('party', '聚会', '🎉'), w('game', '游戏', '🎮'), w('happy', '快乐', '😄'),
    w('June', '六月', '📅'), w('fun', '有趣', '😄')
  ]),
  U('M4', 'Story time', '故事时间', '📖', [
    w('story', '故事', '📖'), w('read', '读', '📖'), w('king', '国王', '👑'),
    w('queen', '女王', '👸'), w('fairy', '仙女', '🧚'), w('magic', '魔法', '✨'),
    w('good', '好', '⭐'), w('bad', '坏', '🤢')
  ])
];

/* ---------------- 四年级（上下册合并） ---------------- */
const U4 = [
  U('M1', 'Hello again', '又见面了', '👋', [
    w('hello', '你好', '👋'), w('meet', '遇见', '🤝'), w('again', '再', '🔁'),
    w('nice', '高兴', '😊'), w('class', '班级', '🏫'), w('grade', '年级', '🔢'),
    w('new', '新', '✨'), w('friend', '朋友', '🤝')
  ]),
  U('M1', 'How old are you?', '你几岁', '🎂', [
    w('old', '岁', '🎂'), w('eleven', '十一', '🔟➕'), w('twelve', '十二', '🔟🔟'),
    w('thirteen', '十三', '1️⃣3️⃣'), w('fourteen', '十四', '1️⃣4️⃣'), w('fifteen', '十五', '1️⃣5️⃣'),
    w('age', '年龄', '🔢'), w('count', '数', '🔢')
  ]),
  U('M1', 'What are you?', '你是做什么的', '🧑‍🏫', [
    w('driver', '司机', '🚌'), w('doctor', '医生', '🩺'), w('nurse', '护士', '👩‍⚕️'),
    w('cook', '厨师', '👨‍🍳'), w('teacher', '老师', '👩‍🏫'), w('student', '学生', '🧑‍🎓'),
    w('worker', '工人', '👷'), w('job', '工作', '💼')
  ]),
  U('M2', 'A new classmate', '新同学', '🤝', [
    w('classmate', '同学', '🧑‍🏫'), w('new', '新', '✨'), w('welcome', '欢迎', '🤗'),
    w('Chinese', '中国的', '🇨🇳'), w('English', '英国的', '🇬🇧'), w('from', '来自', '📍'),
    w('he', '他', '👦'), w('she', '她', '👧')
  ]),
  U('M2', 'How do you feel?', '你感觉怎样', '😊', [
    w('happy', '快乐', '😄'), w('sad', '伤心', '😢'), w('tired', '累', '😴'),
    w('hungry', '饿', '🍽️'), w('thirsty', '渴', '🥤'), w('angry', '生气', '😠'),
    w('feel', '感觉', '💭'), w('fine', '好', '👍')
  ]),
  U('M2', 'Friends', '朋友', '🤝', [
    w('friend', '朋友', '🤝'), w('best', '最好的', '⭐'), w('help', '帮助', '🤝'),
    w('share', '分享', '🤲'), w('play', '玩', '⚽'), w('together', '一起', '🤝'),
    w('kind', '善良', '😇'), w('fun', '有趣', '😄')
  ]),
  U('M3', 'In the school', '在学校', '🏫', [
    w('school', '学校', '🏫'), w('office', '办公室', '🏢'), w('hall', '大厅', '🏛️'),
    w('gym', '体育馆', '🏟️'), w('library', '图书馆', '📚'), w('classroom', '教室', '🏫'),
    w('where', '哪里', '❓'), w('there', '那里', '📍')
  ]),
  U('M4', 'On the farm', '在农场', '🚜', [
    w('farm', '农场', '🚜'), w('cow', '奶牛', '🐄'), w('pig', '猪', '🐖'),
    w('sheep', '羊', '🐑'), w('horse', '马', '🐴'), w('duck', '鸭', '🦆'),
    w('chicken', '鸡', '🐔'), w('egg', '蛋', '🥚')
  ]),
  U('M4', 'More insects and plants', '更多昆虫和植物', '🐛', [
    w('insect', '昆虫', '🐛'), w('bee', '蜜蜂', '🐝'), w('butterfly', '蝴蝶', '🦋'),
    w('ant', '蚂蚁', '🐜'), w('plant', '植物', '🌱'), w('leaf', '叶子', '🍃'),
    w('flower', '花', '🌸'), w('green', '绿色', '🟢')
  ]),
  U('M4', 'A day in the park', '公园里的一天', '🌳', [
    w('park', '公园', '🌳'), w('morning', '早上', '🌅'), w('afternoon', '下午', '☀️'),
    w('evening', '晚上', '🌆'), w('walk', '走', '🚶'), w('play', '玩', '⚽'),
    w('boat', '船', '⛵'), w('happy', '快乐', '😄')
  ]),
  U('M1', 'Look!', '看', '👀', [
    w('look', '看', '👀'), w('see', '看见', '👀'), w('beautiful', '美丽', '🌸'),
    w('colourful', '多彩', '🌈'), w('flower', '花', '🌸'), w('sky', '天空', '🌌'),
    w('cloud', '云', '☁️'), w('bright', '亮', '✨')
  ]),
  U('M1', 'What can you hear?', '你能听见什么', '👂', [
    w('hear', '听', '👂'), w('sound', '声音', '🔊'), w('bell', '铃', '🔔'),
    w('phone', '电话', '📞'), w('music', '音乐', '🎵'), w('bird', '鸟', '🐦'),
    w('quiet', '安静', '🤫'), w('loud', '响', '📢')
  ]),
  U('M1', 'What can you feel?', '你能感觉到什么', '✋', [
    w('feel', '感觉', '💭'), w('touch', '摸', '✋'), w('soft', '软', '🧸'),
    w('hard', '硬', '🪨'), w('smooth', '光滑', '✨'), w('rough', '粗糙', '🪵'),
    w('hot', '热', '🔥'), w('cold', '冷', '🥶')
  ]),
  U('M1', 'What can you smell and taste?', '闻和尝', '👅', [
    w('smell', '闻', '👃'), w('taste', '尝', '👅'), w('sweet', '甜', '🍬'),
    w('sour', '酸', '🍋'), w('flower', '花', '🌸'), w('fruit', '水果', '🍎'),
    w('yummy', '好吃', '😋'), w('bad', '坏', '🤢')
  ]),
  U('M2', 'My pet', '我的宠物', '🐾', [
    w('pet', '宠物', '🐾'), w('dog', '狗', '🐶'), w('cat', '猫', '🐱'),
    w('fish', '鱼', '🐟'), w('rabbit', '兔', '🐰'), w('bird', '鸟', '🐦'),
    w('cute', '可爱', '🥰'), w('feed', '喂', '🍖')
  ]),
  U('M2', 'My toys', '我的玩具', '🧸', [
    w('toy', '玩具', '🧸'), w('teddy', '泰迪', '🧸'), w('ball', '球', '⚽'),
    w('car', '车', '🚗'), w('doll', '娃娃', '🪆'), w('kite', '风筝', '🪁'),
    w('robot', '机器人', '🤖'), w('play', '玩', '⚽')
  ]),
  U('M2', 'A busy family', '忙碌的家庭', '👨‍👩‍👧', [
    w('busy', '忙', '😅'), w('father', '爸爸', '👨'), w('mother', '妈妈', '👩'),
    w('wash', '洗', '🧼'), w('cook', '煮', '🍳'), w('clean', '打扫', '🧹'),
    w('help', '帮助', '🤝'), w('home', '家', '🏠')
  ]),
  U('M3', 'Colours and places', '颜色与地点', '🎨', [
    w('red', '红', '🔴'), w('blue', '蓝', '🔵'), w('yellow', '黄', '🟡'),
    w('green', '绿', '🟢'), w('park', '公园', '🌳'), w('zoo', '动物园', '🦁'),
    w('shop', '商店', '🏪'), w('school', '学校', '🏫')
  ]),
  U('M3', 'Listen!', '听', '🔊', [
    w('listen', '听', '👂'), w('noise', '噪音', '🔊'), w('bell', '铃', '🔔'),
    w('car', '车', '🚗'), w('bus', '公交', '🚌'), w('rain', '雨', '🌧️'),
    w('wind', '风', '🌬️'), w('sound', '声音', '🔊')
  ]),
  U('M3', 'Weather', '天气', '☁️', [
    w('sunny', '晴', '☀️'), w('rainy', '雨', '🌧️'), w('cloudy', '云', '☁️'),
    w('windy', '风', '🌬️'), w('snowy', '雪', '❄️'), w('hot', '热', '🔥'),
    w('cold', '冷', '🥶'), w('weather', '天气', '🌤️')
  ])
];

/* ---------------- 五年级（上下册合并） ---------------- */
const U5 = [
  U('M1', 'Can I do this?', '我能做这个吗', '❓', [
    w('can', '能', '✅'), w('may', '可以', '🙏'), w('must', '必须', '📌'),
    w('should', '应该', '💡'), w('park', '停车', '🅿️'), w('litter', '扔垃圾', '🗑️'),
    w('quiet', '安静', '🤫'), w('rule', '规则', '📏')
  ]),
  U('M1', 'This is what I want', '这就是我想要的', '🛒', [
    w('want', '想要', '🛒'), w('need', '需要', '📝'), w('toy', '玩具', '🧸'),
    w('book', '书', '📕'), w('buy', '买', '🛒'), w('shop', '商店', '🏪'),
    w('new', '新', '✨'), w('like', '喜欢', '❤️')
  ]),
  U('M2', 'Me', '我', '🙋', [
    w('I', '我', '🙋'), w('am', '是', '✅'), w('like', '喜欢', '❤️'),
    w('have', '有', '🎁'), w('can', '会', '✅'), w('happy', '快乐', '😄'),
    w('tall', '高', '🦒'), w('help', '帮助', '🤝')
  ]),
  U('M2', 'Are you happy?', '你快乐吗', '😊', [
    w('happy', '快乐', '😄'), w('sad', '伤心', '😢'), w('angry', '生气', '😠'),
    w('tired', '累', '😴'), w('excited', '兴奋', '🤩'), w('bored', '无聊', '😑'),
    w('feel', '感觉', '💭'), w('why', '为什么', '❓')
  ]),
  U('M2', 'A birthday party', '生日派对', '🎂', [
    w('birthday', '生日', '🎂'), w('party', '聚会', '🎉'), w('cake', '蛋糕', '🍰'),
    w('gift', '礼物', '🎁'), w('balloon', '气球', '🎈'), w('candle', '蜡烛', '🕯️'),
    w('sing', '唱', '🎤'), w('happy', '快乐', '😄')
  ]),
  U('M3', 'A day at school', '学校的一天', '🏫', [
    w('school', '学校', '🏫'), w('lesson', '课', '📚'), w('break', '休息', '☕'),
    w('lunch', '午餐', '🍱'), w('play', '玩', '⚽'), w('study', '学习', '📖'),
    w('teacher', '老师', '👩‍🏫'), w('student', '学生', '🧑‍🎓')
  ]),
  U('M3', "Let's go shopping!", '去购物', '🛒', [
    w('shop', '商店', '🏪'), w('buy', '买', '🛒'), w('clothes', '衣服', '👕'),
    w('food', '食物', '🍎'), w('toy', '玩具', '🧸'), w('money', '钱', '💰'),
    w('how much', '多少', '❓'), w('sale', '打折', '🏷️')
  ]),
  U('M3', 'Follow the signs!', '看标志', '🪧', [
    w('sign', '标志', '🪧'), w('stop', '停', '🛑'), w('go', '走', '🚶'),
    w('wait', '等', '⏳'), w('danger', '危险', '⚠️'), w('no', '禁止', '🚫'),
    w('exit', '出口', '🚪'), w('safe', '安全', '✅')
  ]),
  U('M4', 'Wild animals', '野生动物', '🐯', [
    w('tiger', '老虎', '🐯'), w('lion', '狮子', '🦁'), w('elephant', '大象', '🐘'),
    w('panda', '熊猫', '🐼'), w('monkey', '猴子', '🐵'), w('bear', '熊', '🐻'),
    w('wild', '野生', '🌲'), w('strong', '强壮', '💪')
  ]),
  U('M4', 'Butterflies', '蝴蝶', '🦋', [
    w('butterfly', '蝴蝶', '🦋'), w('wing', '翅膀', '🦋'), w('egg', '蛋', '🥚'),
    w('caterpillar', '毛毛虫', '🐛'), w('cocoon', '茧', '🥚'), w('fly', '飞', '✈️'),
    w('colour', '颜色', '🎨'), w('beautiful', '美丽', '🌸')
  ]),
  U('M4', 'Parks and places in China', '中国的公园和地点', '🏞️', [
    w('park', '公园', '🌳'), w('Great Wall', '长城', '🧱'), w('Beijing', '北京', '🇨🇳'),
    w('Shanghai', '上海', '🏙️'), w('mountain', '山', '⛰️'), w('river', '河', '🌊'),
    w('visit', '参观', '🎫'), w('China', '中国', '🇨🇳')
  ]),
  U('M1', 'Use your eyes!', '用你的眼睛', '👀', [
    w('eye', '眼睛', '👁️'), w('see', '看', '👀'), w('read', '读', '📖'),
    w('watch', '看', '📺'), w('look', '看', '👀'), w('colour', '颜色', '🎨'),
    w('beautiful', '美丽', '🌸'), w('red', '红', '🔴')
  ]),
  U('M1', 'Use your ears!', '用你的耳朵', '👂', [
    w('ear', '耳朵', '👂'), w('hear', '听', '👂'), w('listen', '听', '👂'),
    w('music', '音乐', '🎵'), w('sound', '声音', '🔊'), w('song', '歌', '🎵'),
    w('quiet', '安静', '🤫'), w('loud', '响', '📢')
  ]),
  U('M1', 'Use your hands!', '用你的手', '✋', [
    w('hand', '手', '✋'), w('touch', '摸', '✋'), w('make', '做', '🛠️'),
    w('write', '写', '✍️'), w('draw', '画', '🎨'), w('feel', '感觉', '💭'),
    w('help', '帮助', '🤝'), w('work', '工作', '💼')
  ]),
  U('M1', 'Use your five senses!', '用你的五官', '👀', [
    w('smell', '闻', '👃'), w('taste', '尝', '👅'), w('touch', '摸', '✋'),
    w('see', '看', '👀'), w('hear', '听', '👂'), w('nose', '鼻子', '👃'),
    w('tongue', '舌头', '👅'), w('sense', '感觉', '💡')
  ]),
  U('M2', 'Animals in the zoo', '动物园的动物', '🦁', [
    w('lion', '狮子', '🦁'), w('tiger', '老虎', '🐯'), w('panda', '熊猫', '🐼'),
    w('monkey', '猴子', '🐵'), w('elephant', '大象', '🐘'), w('giraffe', '长颈鹿', '🦒'),
    w('zebra', '斑马', '🦓'), w('zoo', '动物园', '🦁')
  ]),
  U('M2', 'Favourite toys', '最爱的玩具', '🧸', [
    w('toy', '玩具', '🧸'), w('puzzle', '拼图', '🧩'), w('lego', '乐高', '🧱'),
    w('ball', '球', '⚽'), w('doll', '娃娃', '🪆'), w('kite', '风筝', '🪁'),
    w('robot', '机器人', '🤖'), w('favourite', '最爱', '⭐')
  ]),
  U('M2', 'At home', '在家', '🏠', [
    w('home', '家', '🏠'), w('room', '房间', '🛏️'), w('kitchen', '厨房', '🍳'),
    w('bedroom', '卧室', '🛏️'), w('living room', '客厅', '🛋️'), w('bathroom', '浴室', '🛁'),
    w('clean', '打扫', '🧹'), w('live', '住', '🏠')
  ]),
  U('M3', 'Colours around us', '我们周围的颜色', '🎨', [
    w('red', '红', '🔴'), w('blue', '蓝', '🔵'), w('green', '绿', '🟢'),
    w('yellow', '黄', '🟡'), w('sky', '天空', '🌌'), w('grass', '草', '🌿'),
    w('flower', '花', '🌸'), w('autumn', '秋', '🍂')
  ]),
  U('M3', 'Different noises', '不同的声音', '🔊', [
    w('noise', '噪音', '🔊'), w('loud', '响', '📢'), w('quiet', '安静', '🤫'),
    w('bell', '铃', '🔔'), w('car', '车', '🚗'), w('rain', '雨', '🌧️'),
    w('music', '音乐', '🎵'), w('sound', '声音', '🔊')
  ]),
  U('M3', 'What is the weather like?', '天气怎么样', '☁️', [
    w('sunny', '晴', '☀️'), w('rainy', '雨', '🌧️'), w('cloudy', '云', '☁️'),
    w('windy', '风', '🌬️'), w('snowy', '雪', '❄️'), w('warm', '暖', '🌞'),
    w('hot', '热', '🔥'), w('cold', '冷', '🥶')
  ])
];

/* ---------------- 六年级（上下册合并） ---------------- */
const U6 = [
  U('M1', 'Family and relatives', '家人和亲戚', '👨‍👩‍👧', [
    w('grandfather', '爷爷', '👴'), w('grandmother', '奶奶', '👵'), w('father', '爸爸', '👨'),
    w('mother', '妈妈', '👩'), w('uncle', '叔叔', '👨'), w('aunt', '阿姨', '👩'),
    w('cousin', '表亲', '🧒'), w('relative', '亲戚', '🤝')
  ]),
  U('M1', 'I have a good friend', '我有个好朋友', '🤝', [
    w('friend', '朋友', '🤝'), w('friendly', '友好的', '😊'), w('helpful', '有帮助的', '🤝'),
    w('polite', '礼貌的', '🙇'), w('kind', '善良的', '😇'), w('share', '分享', '🤲'),
    w('together', '一起', '🤝'), w('care', '关心', '❤️')
  ]),
  U('M1', 'Spending a day out together', '一起外出一天', '🚞', [
    w('out', '外出', '🚪'), w('park', '公园', '🌳'), w('museum', '博物馆', '🏛️'),
    w('zoo', '动物园', '🦁'), w('cinema', '电影院', '🎬'), w('together', '一起', '🤝'),
    w('fun', '有趣', '😄'), w('weekend', '周末', '📅')
  ]),
  U('M1', 'What would you like to be?', '你想做什么', '💼', [
    w('doctor', '医生', '🩺'), w('nurse', '护士', '👩‍⚕️'), w('teacher', '老师', '👩‍🏫'),
    w('driver', '司机', '🚌'), w('cook', '厨师', '👨‍🍳'), w('pilot', '飞行员', '✈️'),
    w('engineer', '工程师', '🛠️'), w('job', '工作', '💼')
  ]),
  U('M2', 'Open Day', '开放日', '🏫', [
    w('open', '开', '🔓'), w('day', '天', '📅'), w('parent', '家长', '👨‍👩‍👧'),
    w('visit', '参观', '🎫'), w('classroom', '教室', '🏫'), w('hall', '大厅', '🏛️'),
    w('meeting', '会议', '📋'), w('welcome', '欢迎', '🤗')
  ]),
  U('M2', 'Going to school', '去上学', '🚌', [
    w('school', '学校', '🏫'), w('bus', '公交', '🚌'), w('walk', '走', '🚶'),
    w('ride', '骑', '🚲'), w('far', '远', '📏'), w('near', '近', '📍'),
    w('minute', '分钟', '⏱️'), w('usually', '通常', '⏰')
  ]),
  U('M2', 'Rules round us', '我们身边的规则', '📏', [
    w('rule', '规则', '📏'), w('must', '必须', '📌'), w('must not', '禁止', '🚫'),
    w('cross', '过', '➡️'), w('road', '路', '🛣️'), w('safe', '安全', '✅'),
    w('light', '灯', '💡'), w('careful', '小心', '⚠️')
  ]),
  U('M3', 'The food we eat', '我们吃的食物', '🍎', [
    w('food', '食物', '🍎'), w('rice', '米饭', '🍚'), w('noodle', '面条', '🍜'),
    w('meat', '肉', '🍖'), w('vegetable', '蔬菜', '🥦'), w('fruit', '水果', '🍎'),
    w('healthy', '健康', '💪'), w('eat', '吃', '😋')
  ]),
  U('M3', 'Picnics are fun', '野餐真有趣', '🧺', [
    w('picnic', '野餐', '🧺'), w('park', '公园', '🌳'), w('bread', '面包', '🍞'),
    w('juice', '果汁', '🧃'), w('sandwich', '三明治', '🥪'), w('apple', '苹果', '🍎'),
    w('fun', '有趣', '😄'), w('outside', '外面', '🌳')
  ]),
  U('M3', 'Healthy eating', '健康饮食', '🥗', [
    w('healthy', '健康', '💪'), w('eat', '吃', '😋'), w('vegetable', '蔬菜', '🥦'),
    w('fruit', '水果', '🍎'), w('less', '更少', '➖'), w('more', '更多', '➕'),
    w('sugar', '糖', '🍬'), w('water', '水', '💧')
  ]),
  U('M3', "Let's make a pizza", '做披萨', '🍕', [
    w('pizza', '披萨', '🍕'), w('make', '做', '🛠️'), w('tomato', '番茄', '🍅'),
    w('cheese', '奶酪', '🧀'), w('dough', '面团', '🥟'), w('oven', '烤箱', '🔥'),
    w('yummy', '好吃', '😋'), w('cook', '煮', '🍳')
  ]),
  U('M1', 'Great cities in Asia', '亚洲大城市', '🏙️', [
    w('city', '城市', '🏙️'), w('Tokyo', '东京', '🗼'), w('Bangkok', '曼谷', '🛕'),
    w('Beijing', '北京', '🇨🇳'), w('big', '大', '🐘'), w('busy', '繁忙', '😅'),
    w('shop', '商店', '🏪'), w('visit', '参观', '🎫')
  ]),
  U('M1', 'At the airport', '在机场', '✈️', [
    w('airport', '机场', '✈️'), w('plane', '飞机', '✈️'), w('fly', '飞', '✈️'),
    w('arrive', '到达', '📍'), w('depart', '离开', '🚪'), w('ticket', '票', '🎫'),
    w('passport', '护照', '📔'), w('travel', '旅行', '🧳')
  ]),
  U('M1', 'Dragon Boat Festival', '端午节', '🐉', [
    w('festival', '节日', '🎊'), w('dragon', '龙', '🐉'), w('boat', '船', '⛵'),
    w('race', '比赛', '🏁'), w('rice', '米饭', '🍚'), w('zongzi', '粽子', '🍙'),
    w('May', '五月', '📅'), w('traditional', '传统的', '🏮')
  ]),
  U('M1', 'Staying healthy', '保持健康', '💪', [
    w('healthy', '健康', '💪'), w('exercise', '运动', '🏋️'), w('sleep', '睡', '😴'),
    w('eat', '吃', '😋'), w('vegetable', '蔬菜', '🥦'), w('water', '水', '💧'),
    w('doctor', '医生', '🩺'), w('strong', '强壮', '💪')
  ]),
  U('M2', 'What will I be like?', '我将来会怎样', '🔮', [
    w('will', '将', '🔮'), w('future', '未来', '🔮'), w('tall', '高', '🦒'),
    w('short', '矮', '🐰'), w('thin', '瘦', '🐱'), w('fat', '胖', '🐻'),
    w('doctor', '医生', '🩺'), w('teacher', '老师', '👩‍🏫')
  ]),
  U('M2', 'Seasonal changes', '季节变化', '🍂', [
    w('season', '季节', '🍂'), w('spring', '春', '🌸'), w('summer', '夏', '☀️'),
    w('autumn', '秋', '🍂'), w('winter', '冬', '❄️'), w('change', '变化', '🔄'),
    w('weather', '天气', '🌤️'), w('leaf', '叶子', '🍃')
  ]),
  U('M2', 'Travelling in Garden City', '在花园城旅行', '🧳', [
    w('travel', '旅行', '🧳'), w('train', '火车', '🚆'), w('bus', '公交', '🚌'),
    w('hotel', '酒店', '🏨'), w('visit', '参观', '🎫'), w('map', '地图', '🗺️'),
    w('fun', '有趣', '😄'), w('trip', '旅行', '🧳')
  ]),
  U('M3', 'Windy weather', '有风的天气', '🌬️', [
    w('wind', '风', '🌬️'), w('blow', '吹', '🌬️'), w('strong', '强', '💪'),
    w('gentle', '轻', '🍃'), w('kite', '风筝', '🪁'), w('cloud', '云', '☁️'),
    w('weather', '天气', '🌤️'), w('storm', '风暴', '⛈️')
  ]),
  U('M3', 'Sea water and rain water', '海水和雨水', '💧', [
    w('sea', '海', '🌊'), w('water', '水', '💧'), w('rain', '雨', '🌧️'),
    w('river', '河', '🌊'), w('lake', '湖', '💧'), w('drop', '滴', '💧'),
    w('salt', '盐', '🧂'), w('tide', '潮', '🌊')
  ]),
  U('M3', 'Forests and land', '森林与土地', '🌲', [
    w('forest', '森林', '🌲'), w('tree', '树', '🌳'), w('land', '土地', '🟫'),
    w('wood', '木头', '🪵'), w('animal', '动物', '🐾'), w('green', '绿色', '🟢'),
    w('protect', '保护', '🛡️'), w('earth', '地球', '🌍')
  ]),
  U('M3', 'Controlling fire', '控制火', '🔥', [
    w('fire', '火', '🔥'), w('burn', '烧', '🔥'), w('match', '火柴', '🔥'),
    w('danger', '危险', '⚠️'), w('safe', '安全', '✅'), w('stop', '停', '🛑'),
    w('smoke', '烟', '💨'), w('careful', '小心', '⚠️')
  ])
];

/* ---------------- 七年级（上下册合并） ---------------- */
const U7 = [
  U('M1', 'Relatives in Beijing', '北京的亲戚', '👨‍👩‍👧', [
    w('relative', '亲戚', '🤝'), w('grandfather', '爷爷', '👴'), w('grandmother', '奶奶', '👵'),
    w('uncle', '叔叔', '👨'), w('aunt', '阿姨', '👩'), w('cousin', '表亲', '🧒'),
    w('visit', '参观', '🎫'), w('Beijing', '北京', '🇨🇳')
  ]),
  U('M1', 'Our animal friends', '我们的动物朋友', '🐾', [
    w('animal', '动物', '🐾'), w('dog', '狗', '🐶'), w('cat', '猫', '🐱'),
    w('rabbit', '兔', '🐰'), w('fish', '鱼', '🐟'), w('pet', '宠物', '🐾'),
    w('care', '照顾', '❤️'), w('friend', '朋友', '🤝')
  ]),
  U('M1', 'Friends from other countries', '来自其他国家的朋友', '🌍', [
    w('country', '国家', '🌍'), w('China', '中国', '🇨🇳'), w('Japan', '日本', '🗾'),
    w('friend', '朋友', '🤝'), w('language', '语言', '🗣️'), w('English', '英语', '🇬🇧'),
    w('learn', '学', '📖'), w('different', '不同的', '🔀')
  ]),
  U('M2', 'Jobs people do', '人们做的工作', '💼', [
    w('job', '工作', '💼'), w('doctor', '医生', '🩺'), w('nurse', '护士', '👩‍⚕️'),
    w('teacher', '老师', '👩‍🏫'), w('cook', '厨师', '👨‍🍳'), w('police', '警察', '👮'),
    w('fireman', '消防员', '🚒'), w('postman', '邮递员', '📮')
  ]),
  U('M2', 'Choosing a new flat', '选新公寓', '🏠', [
    w('flat', '公寓', '🏢'), w('room', '房间', '🛏️'), w('bedroom', '卧室', '🛏️'),
    w('kitchen', '厨房', '🍳'), w('bathroom', '浴室', '🛁'), w('balcony', '阳台', '🏐'),
    w('big', '大', '🐘'), w('new', '新', '✨')
  ]),
  U('M2', 'Different places', '不同的地方', '📍', [
    w('place', '地方', '📍'), w('park', '公园', '🌳'), w('library', '图书馆', '📚'),
    w('supermarket', '超市', '🛒'), w('hospital', '医院', '🏥'), w('restaurant', '餐厅', '🍽️'),
    w('near', '近', '📍'), w('far', '远', '📏')
  ]),
  U('M2', 'Signs around us', '身边的标志', '🪧', [
    w('sign', '标志', '🪧'), w('stop', '停', '🛑'), w('go', '走', '🚶'),
    w('danger', '危险', '⚠️'), w('no', '禁止', '🚫'), w('exit', '出口', '🚪'),
    w('information', '信息', 'ℹ️'), w('safe', '安全', '✅')
  ]),
  U('M3', 'Growing healthy, growing strong', '健康成长', '💪', [
    w('healthy', '健康', '💪'), w('grow', '长', '🌿'), w('strong', '强壮', '💪'),
    w('eat', '吃', '😋'), w('exercise', '运动', '🏋️'), w('sleep', '睡', '😴'),
    w('vegetable', '蔬菜', '🥦'), w('fruit', '水果', '🍎')
  ]),
  U('M3', 'International Food Festival', '国际美食节', '🍜', [
    w('food', '食物', '🍎'), w('festival', '节日', '🎊'), w('noodle', '面条', '🍜'),
    w('rice', '米饭', '🍚'), w('dumpling', '饺子', '🥟'), w('pizza', '披萨', '🍕'),
    w('sushi', '寿司', '🍣'), w('taste', '尝', '👅')
  ]),
  U('M3', 'A birthday party', '生日派对', '🎂', [
    w('birthday', '生日', '🎂'), w('party', '聚会', '🎉'), w('cake', '蛋糕', '🍰'),
    w('gift', '礼物', '🎁'), w('balloon', '气球', '🎈'), w('candle', '蜡烛', '🕯️'),
    w('sing', '唱', '🎤'), w('happy', '快乐', '😄')
  ]),
  U('M3', 'My food project', '我的食物项目', '🥗', [
    w('project', '项目', '📋'), w('food', '食物', '🍎'), w('healthy', '健康', '💪'),
    w('fruit', '水果', '🍎'), w('vegetable', '蔬菜', '🥦'), w('plan', '计划', '📝'),
    w('make', '做', '🛠️'), w('present', '展示', '🎤')
  ]),
  U('U1', 'Music', '音乐', '🎵', [
    w('music', '音乐', '🎵'), w('song', '歌', '🎵'), w('sing', '唱', '🎤'),
    w('instrument', '乐器', '🎻'), w('piano', '钢琴', '🎹'), w('guitar', '吉他', '🎸'),
    w('listen', '听', '👂'), w('concert', '音乐会', '🎼')
  ]),
  U('U2', 'Language and communication', '语言与沟通', '🗣️', [
    w('language', '语言', '🗣️'), w('speak', '说', '🗣️'), w('write', '写', '✍️'),
    w('read', '读', '📖'), w('email', '邮件', '📧'), w('message', '信息', '💬'),
    w('communicate', '沟通', '🤝'), w('learn', '学', '📖')
  ]),
  U('U3', 'A helping hand', '援手', '🤝', [
    w('help', '帮助', '🤝'), w('friend', '朋友', '🤝'), w('kind', '善良', '😇'),
    w('care', '关心', '❤️'), w('volunteer', '志愿者', '🤝'), w('give', '给', '🤲'),
    w('community', '社区', '🏘️'), w('thank you', '谢谢', '🙏')
  ]),
  U('U4', 'Honesty', '诚实', '🤝', [
    w('honest', '诚实', '🤝'), w('truth', '真相', '🔍'), w('promise', '承诺', '🤝'),
    w('right', '对', '✅'), w('wrong', '错', '❌'), w('sorry', '对不起', '🥺'),
    w('trust', '信任', '🤝'), w('good', '好', '⭐')
  ]),
  U('U5', 'Wild animals', '野生动物', '🐯', [
    w('wild', '野生', '🌲'), w('animal', '动物', '🐾'), w('tiger', '老虎', '🐯'),
    w('panda', '熊猫', '🐼'), w('elephant', '大象', '🐘'), w('protect', '保护', '🛡️'),
    w('danger', '危险', '⚠️'), w('nature', '自然', '🌿')
  ])
];

/* ---------------- 八年级上 (8A) ---------------- */
const U8 = [
  U('U1', 'Look it up!', '查阅', '📖', [
    w('dictionary', '字典', '📖'), w('look up', '查阅', '🔍'), w('word', '单词', '🔤'),
    w('book', '书', '📕'), w('information', '信息', 'ℹ️'), w('computer', '电脑', '💻'),
    w('search', '搜索', '🔍'), w('learn', '学', '📖')
  ]),
  U('U2', 'Amazing numbers', '神奇的数字', '🔢', [
    w('number', '数字', '🔢'), w('zero', '零', '0️⃣'), w('hundred', '百', '💯'),
    w('thousand', '千', '🔢'), w('count', '数', '🔢'), w('big', '大', '🐘'),
    w('small', '小', '🔘'), w('math', '数学', '➗')
  ]),
  U('U3', 'Our digital lives', '我们的数字生活', '💻', [
    w('computer', '电脑', '💻'), w('phone', '手机', '📱'), w('internet', '网络', '🌐'),
    w('email', '邮件', '📧'), w('game', '游戏', '🎮'), w('online', '在线', '🌐'),
    w('message', '信息', '💬'), w('friend', '朋友', '🤝')
  ]),
  U('U4', 'Inventions', '发明', '💡', [
    w('invention', '发明', '💡'), w('light', '灯', '💡'), w('wheel', '轮子', '⚙️'),
    w('telephone', '电话', '📞'), w('car', '汽车', '🚗'), w('useful', '有用', '✅'),
    w('old', '旧的', '🕰️'), w('new', '新的', '✨')
  ]),
  U('U5', 'Going on an exchange trip', '交流旅行', '✈️', [
    w('trip', '旅行', '🧳'), w('exchange', '交流', '🤝'), w('country', '国家', '🌍'),
    w('visit', '参观', '🎫'), w('host', '接待', '🤝'), w('language', '语言', '🗣️'),
    w('friend', '朋友', '🤝'), w('learn', '学', '📖')
  ]),
  U('U6', 'Wisdom counts', '智慧重要', '💡', [
    w('wise', '聪明', '🦉'), w('think', '想', '💭'), w('learn', '学', '📖'),
    w('problem', '问题', '❓'), w('solve', '解决', '✅'), w('idea', '主意', '💡'),
    w('clever', '聪明', '🦊'), w('count', '重要', '🔢')
  ]),
  U('U7', 'The secret of memory', '记忆的秘密', '🧠', [
    w('memory', '记忆', '🧠'), w('remember', '记得', '🧠'), w('forget', '忘记', '🤔'),
    w('brain', '脑', '🧠'), w('study', '学', '📖'), w('practice', '练习', '✍️'),
    w('easy', '容易', '✅'), w('hard', '难', '🪨')
  ]),
  U('U8', 'Pets and us', '宠物与我们', '🐾', [
    w('pet', '宠物', '🐾'), w('dog', '狗', '🐶'), w('cat', '猫', '🐱'),
    w('fish', '鱼', '🐟'), w('care', '照顾', '❤️'), w('feed', '喂', '🍖'),
    w('love', '爱', '❤️'), w('friend', '朋友', '🤝')
  ])
];

/* ---------------- 九年级（新教材 2024） ---------------- */
const U9 = [
  U('U1', 'Great people', '伟大的人', '🌟', [
    w('great', '伟大的', '🌟'), w('person', '人', '🧑'), w('scientist', '科学家', '🔬'),
    w('inventor', '发明家', '💡'), w('writer', '作家', '✍️'), w('hero', '英雄', '🦸'),
    w('famous', '著名的', '🏆'), w('change', '改变', '🔄')
  ]),
  U('U2', 'Great ideas', '伟大的想法', '💡', [
    w('idea', '想法', '💡'), w('invent', '发明', '💡'), w('useful', '有用', '✅'),
    w('problem', '问题', '❓'), w('solve', '解决', '✅'), w('create', '创造', '🛠️'),
    w('think', '想', '💭'), w('share', '分享', '🤲')
  ]),
  U('U3', 'Family traditions', '家庭传统', '🏮', [
    w('family', '家庭', '🏠'), w('tradition', '传统', '🏮'), w('festival', '节日', '🎊'),
    w('celebrate', '庆祝', '🎊'), w('custom', '习俗', '🏮'), w('dinner', '晚餐', '🍽️'),
    w('gift', '礼物', '🎁'), w('together', '一起', '🤝')
  ]),
  U('U4', 'A better me', '更好的我', '💪', [
    w('better', '更好', '⬆️'), w('healthy', '健康', '💪'), w('habit', '习惯', '🔁'),
    w('exercise', '运动', '🏋️'), w('study', '学', '📖'), w('improve', '提高', '⬆️'),
    w('goal', '目标', '🎯'), w('try', '尝试', '💪')
  ]),
  U('U5', 'My time, my joy', '我的时光我的快乐', '⏰', [
    w('time', '时间', '⏰'), w('hobby', '爱好', '🎨'), w('joy', '快乐', '😄'),
    w('read', '读', '📖'), w('sport', '运动', '🏅'), w('music', '音乐', '🎵'),
    w('relax', '放松', '😌'), w('happy', '快乐', '😄')
  ]),
  U('U6', 'Food and health', '食物与健康', '🥗', [
    w('food', '食物', '🍎'), w('healthy', '健康', '💪'), w('vegetable', '蔬菜', '🥦'),
    w('fruit', '水果', '🍎'), w('sugar', '糖', '🍬'), w('less', '更少', '➖'),
    w('balance', '平衡', '⚖️'), w('eat', '吃', '😋')
  ]),
  U('U7', 'Reading Mark Twain', '读马克·吐温', '📖', [
    w('read', '读', '📖'), w('writer', '作家', '✍️'), w('story', '故事', '📖'),
    w('book', '书', '📕'), w('famous', '著名的', '🏆'), w('adventure', '冒险', '🗺️'),
    w('funny', '有趣', '😄'), w('word', '单词', '🔤')
  ]),
  U('U8', 'The power of love', '爱的力量', '❤️', [
    w('love', '爱', '❤️'), w('family', '家庭', '🏠'), w('friend', '朋友', '🤝'),
    w('care', '关心', '❤️'), w('help', '帮助', '🤝'), w('kind', '善良', '😇'),
    w('give', '给', '🤲'), w('happy', '快乐', '😄')
  ])
];

/* ---------------- 英语学科：牛津上海版（沪教版）一年级~九年级 ---------------- */
const englishSubject = {
  id: 'english', name: '英语', emoji: '🔤', lang: 'en',
  subtitle: '牛津上海版 · 一年级~九年级',
  grades: [
    { id: 'g1', name: '一年级',   emoji: '🌱', units: U1A.concat(U1B) },
    { id: 'g2', name: '二年级',   emoji: '🌿', units: U2A.concat(U2B) },
    { id: 'g3', name: '三年级',   emoji: '🌟', units: U3 },
    { id: 'g4', name: '四年级',   emoji: '🔥', units: U4 },
    { id: 'g5', name: '五年级',   emoji: '⭐', units: U5 },
    { id: 'g6', name: '六年级',   emoji: '🚀', units: U6 },
    { id: 'g7', name: '七年级',   emoji: '💡', units: U7 },
    { id: 'g8', name: '八年级',   emoji: '🌈', units: U8 },
    { id: 'g9', name: '九年级',   emoji: '🏅', units: U9 }
  ]
};

/* ---------------- 语文学科：人教版一年级·汉语拼音 ---------------- */
// 拼音项构造：py=拼音(带声调)，zh=示范汉字（朗读与显示都用汉字发音）
function P(py, zh, emoji) { return { py: py, zh: zh, emoji: emoji || '🔤' }; }
// 语文单元构造（复用标准 4 阶段：学一学/跟我读/听音选词/闯关测验）
function CU(name, emoji, items) {
  return { name: name, emoji: emoji, words: items, sentences: [], stages: stdStages() };
}
const ZY_U1 = CU('第1课 · 单韵母 a o e', '🅰️', [
  P('ā','啊','👶'), P('á','啊','👶'), P('ǎ','啊','👶'), P('à','啊','👶'),
  P('ō','喔','🐤'), P('ó','哦','🤔'), P('è','饿','🍚'), P('é','鹅','🦢')
]);
const ZY_U2 = CU('第2课 · 单韵母 i u ü', '🅸️', [
  P('ī','衣','👕'), P('í','姨','👩'), P('ǐ','椅','🪑'), P('ì','意','💡'),
  P('ū','屋','🏠'), P('ú','吴','👤'), P('ǔ','五','5️⃣'), P('ù','雾','🌫️'),
  P('ǖ','迂','🌀'), P('ǘ','鱼','🐟'), P('ǚ','雨','🌧️'), P('ǜ','玉','💎')
]);
const ZY_U3 = CU('第3课 · 声母 b p m f', '🅱️', [
  P('bā','巴','🥁'), P('bà','爸','👨'), P('bō','波','🌊'), P('pá','爬','🐛'),
  P('pō','坡','⛰️'), P('mā','妈','👩'), P('mó','摸','✋'), P('fā','发','💇'), P('fó','佛','🛕')
]);
const ZY_U4 = CU('第4课 · 声母 d t n l', '🇩', [
  P('dà','大','🔢'), P('dī','滴','💧'), P('tā','他','👤'), P('tí','提','👜'),
  P('nǎ','哪','❓'), P('ná','拿','✊'), P('lè','乐','😄'), P('lù','路','🛣️')
]);
const ZY_U5 = CU('第5课 · 声母 g k h', '🇬', [
  P('gē','哥','👦'), P('gū','姑','👩'), P('kē','棵','🌳'), P('kǔ','苦','😣'),
  P('hē','喝','🥤'), P('hú','胡','🧔')
]);
const ZY_U6 = CU('第6课 · 声母 j q x', '🇯', [
  P('jī','鸡','🐔'), P('jú','橘','🍊'), P('qī','七','7️⃣'), P('qí','旗','🚩'),
  P('xī','西','🌅'), P('xū','须','💇')
]);
const ZY_U7 = CU('第7课 · 声母 z c s', '🇿', [
  P('zā','扎','📦'), P('zá','杂','🗑️'), P('cā','擦','🧻'), P('cí','词','🔤'),
  P('sǎ','洒','💦'), P('sī','丝','🧵'), P('zī','资','💰'), P('cī','疵','⚠️')
]);
const ZY_U8 = CU('第8课 · 声母 zh ch sh r', '🇷', [
  P('zhī','织','🧶'), P('zhū','猪','🐷'), P('chá','茶','🍵'), P('chē','车','🚗'),
  P('shī','狮','🦁'), P('shù','树','🌳'), P('rì','日','☀️'), P('ròu','肉','🍖')
]);
const ZY_U9 = CU('第9课 · 复韵母 ai ei ui', '🇦', [
  P('āi','挨','🤝'), P('ái','矮','📏'), P('ài','爱','❤️'), P('hēi','黑','⚫'),
  P('huī','灰','🌫️'), P('bái','白','⚪'), P('wěi','尾','🐈')
]);
const ZY_U10 = CU('第10课 · 复韵母 ao ou iu', '🇴', [
  P('āo','凹','🔽'), P('áo','熬','🍲'), P('ǎo','袄','🧥'), P('ào','傲','😎'),
  P('ōu','欧','🌍'), P('hóu','猴','🐵'), P('liú','流','💧'), P('bāo','包','🎒')
]);
const ZY_U11 = CU('第11课 · 复韵母 ie üe er', '🇮', [
  P('iē','耶','🗣️'), P('xié','鞋','👟'), P('yuè','月','🌙'), P('èr','二','2️⃣'),
  P('ěr','耳','👂'), P('ér','儿','👶')
]);
const ZY_U12 = CU('第12课 · 鼻韵母 an en in un ün', '🇦', [
  P('ān','安','🕊️'), P('bān','班','🏫'), P('mén','门','🚪'), P('jīn','斤','⚖️'),
  P('lún','轮','🛞'), P('yún','云','☁️'), P('nín','您','🙇')
]);
const ZY_U13 = CU('第13课 · 鼻韵母 ang eng ing ong', '🇦', [
  P('bāng','帮','🤝'), P('dēng','灯','💡'), P('jīng','京','🏯'), P('hóng','红','🔴'),
  P('fēng','风','🌬️'), P('xīng','星','⭐')
]);
const ZY_U14 = CU('整体认读音节', '🔢', [
  P('zhi','织','🧶'), P('chi','吃','🍽️'), P('shi','狮','🦁'), P('ri','日','☀️'),
  P('zi','字','🔤'), P('ci','词','🔤'), P('si','丝','🧵'), P('yi','衣','👕'),
  P('wu','屋','🏠'), P('yu','鱼','🐟'), P('ye','叶','🍃'), P('yue','月','🌙'),
  P('yuan','圆','⭕'), P('yin','音','🔊'), P('yun','云','☁️'), P('ying','鹰','🦅')
]);
const chineseGrades = [
  { id: 'cz1', name: '一年级（拼音）', emoji: '📖', units: [ZY_U1, ZY_U2, ZY_U3, ZY_U4, ZY_U5, ZY_U6, ZY_U7, ZY_U8, ZY_U9, ZY_U10, ZY_U11, ZY_U12, ZY_U13, ZY_U14] },
  { id: 'cz2', name: '二年级（识字·课文）', emoji: '📚', units: [
    CU('识字1 · 场景歌', '🏞️', [P('tān','滩','🏞️'), P('sōu','艘','🏞️'), P('jūn','军','🏞️'), P('jiàn','舰','🏞️'), P('fān','帆','🏞️'), P('dào','稻','🏞️'), P('yuán','园','🏞️'), P('kǒng','孔','🏞️'), P('cuì','翠','🏞️'), P('duì','队','🏞️'), P('tóng','铜','🏞️'), P('hào','号','🏞️')]),
    CU('识字2 · 树之歌', '🌳', [P('wú','梧','🌳'), P('tóng','桐','🌳'), P('fēng','枫','🌳'), P('sōng','松','🌳'), P('bǎi','柏','🌳'), P('zhuāng','装','🌳'), P('huà','桦','🌳'), P('nài','耐','🌳'), P('shǒu','守','🌳'), P('jiāng','疆','🌳'), P('yín','银','🌳'), P('shān','杉','🌳'), P('huà','化','🌳'), P('guì','桂','🌳')]),
    CU('识字3 · 拍手歌', '👏', [P('què','雀','👏'), P('jǐn','锦','👏'), P('xióng','雄','👏'), P('yīng','鹰','👏'), P('xiáng','翔','👏'), P('yàn','雁','👏'), P('cóng','丛','👏'), P('shēn','深','👏'), P('měng','猛','👏'), P('líng','灵','👏'), P('xiū','休','👏')]),
    CU('识字4 · 田家四季歌', '🌾', [P('jì','季','🌾'), P('hú','蝴','🌾'), P('dié','蝶','🌾'), P('mài','麦','🌾'), P('miáo','苗','🌾'), P('sāng','桑','🌾'), P('féi','肥','🌾'), P('nóng','农','🌾'), P('guī','归','🌾'), P('dài','戴','🌾'), P('cháng','场','🌾'), P('gǔ','谷','🌾'), P('lì','粒','🌾'), P('suī','虽','🌾'), P('xīn','辛','🌾'), P('kǔ','苦','🌾')]),
    CU('课文 · 小蝌蚪找妈妈', '🐸', [P('táng','塘','🐸'), P('nǎo','脑','🐸'), P('dài','袋','🐸'), P('huī','灰','🐸'), P('jiāo','教','🐸'), P('bǔ','捕','🐸'), P('yíng','迎','🐸'), P('yí','姨','🐸'), P('kuān','宽','🐸'), P('guī','龟','🐸'), P('dǐng','顶','🐸'), P('pī','披','🐸'), P('gǔ','鼓','🐸')]),
    CU('课文 · 我是什么', '💧', [P('shài','晒','💧'), P('jí','极','💧'), P('bàng','傍','💧'), P('yuè','越','💧'), P('dī','滴','💧'), P('xī','溪','💧'), P('bēn','奔','💧'), P('yáng','洋','💧'), P('huài','坏','💧'), P('yān','淹','💧'), P('mò','没','💧'), P('chōng','冲','💧'), P('huǐ','毁','💧'), P('wū','屋','💧'), P('cāi','猜','💧')]),
    CU('课文 · 植物妈妈有办法', '🌱', [P('zhí','植','🌱'), P('rú','如','🌱'), P('lǚ','旅','🌱'), P('bèi','备','🌱'), P('fēn','纷','🌱'), P('cì','刺','🌱'), P('dǐ','底','🌱'), P('zhà','炸','🌱'), P('lí','离','🌱'), P('chá','察','🌱'), P('shí','识','🌱'), P('cū','粗','🌱'), P('què','却','🌱')]),
    CU('课文 · 曹冲称象', '🐘', [P('cáo','曹','🐘'), P('chēng','称','🐘'), P('yuán','员','🐘'), P('gēn','根','🐘'), P('zhù','柱','🐘'), P('yì','议','🐘'), P('lùn','论','🐘'), P('zhòng','重','🐘'), P('gǎn','杆','🐘'), P('chèng','秤','🐘'), P('kǎn','砍','🐘'), P('xiàn','线','🐘'), P('zhǐ','止','🐘'), P('liàng','量','🐘')]),
    CU('课文 · 黄山奇石', '⛰️', [P('wén','闻','⛰️'), P('míng','名','⛰️'), P('jǐng','景','⛰️'), P('qū','区','⛰️'), P('shěng','省','⛰️'), P('bù','部','⛰️'), P('xiù','秀','⛰️'), P('yóu','尤','⛰️'), P('qí','其','⛰️'), P('xiān','仙','⛰️'), P('jù','巨','⛰️'), P('wèi','位','⛰️'), P('zhù','著','⛰️'), P('xíng','形','⛰️'), P('zhuàng','状','⛰️')]),
    CU('课文 · 日月潭', '🌊', [P('tán','潭','🌊'), P('hú','湖','🌊'), P('rào','绕','🌊'), P('mào','茂','🌊'), P('shèng','盛','🌊'), P('wéi','围','🌊'), P('shèng','胜','🌊'), P('yāng','央','🌊'), P('dǎo','岛','🌊'), P('huá','华','🌊'), P('shā','纱','🌊'), P('tóng','童','🌊'), P('jìng','境','🌊'), P('yǐn','引','🌊'), P('kè','客','🌊')]),
    CU('课文 · 葡萄沟', '🍇', [P('gōu','沟','🍇'), P('chǎn','产','🍇'), P('fèn','份','🍇'), P('zhī','枝','🍇'), P('dā','搭','🍇'), P('dàn','淡','🍇'), P('gòu','够','🍇'), P('hào','好','🍇'), P('shōu','收','🍇'), P('chéng','城','🍇'), P('shì','市','🍇'), P('liú','留','🍇'), P('dìng','钉','🍇'), P('lì','利','🍇'), P('fēn','分','🍇'), P('wèi','味','🍇')]),
    CU('课文 · 坐井观天', '🐸', [P('yán','沿','🐸'), P('dá','答','🐸'), P('kě','渴','🐸'), P('hē','喝','🐸'), P('huà','话','🐸'), P('nòng','弄','🐸'), P('cuò','错','🐸'), P('jì','际','🐸'), P('nǎ','哪','🐸')]),
    CU('课文 · 我要的是葫芦', '🪣', [P('hú','葫','🪣'), P('lu','芦','🪣'), P('téng','藤','🪣'), P('xiè','谢','🪣'), P('yá','蚜','🪣'), P('dīng','盯','🪣'), P('sài','赛','🪣'), P('gǎn','感','🪣'), P('guài','怪','🪣'), P('màn','慢','🪣')]),
    CU('课文 · 狐假虎威', '🦊', [P('jiǎ','假','🦊'), P('wēi','威','🦊'), P('zhuǎn','转','🦊'), P('chě','扯','🦊'), P('sǎng','嗓','🦊'), P('pài','派','🦊'), P('wéi','违','🦊'), P('kàng','抗','🦊'), P('zhuǎ','爪','🦊'), P('tàng','趟','🦊'), P('shén','神','🦊'), P('zhū','猪','🦊'), P('nà','纳','🦊'), P('mèn','闷','🦊'), P('shòu','受','🦊'), P('piàn','骗','🦊'), P('jiè','借','🦊')])
  ] }
];
const chineseSubject = {
  id: 'chinese', name: '语文', emoji: '📖', lang: 'zh',
  subtitle: '人教版 · 一年级汉语拼音',
  grades: chineseGrades
};

/* ---------------- 组合为多学科 ---------------- */
const CURRICULUM = {
  subjects: [ englishSubject, chineseSubject ]
};

// 自动为单元生成唯一 id（grade.id + '-u' + 序号）
CURRICULUM.subjects.forEach(function (sub) {
  sub.grades.forEach(function (g) {
    g.units.forEach(function (u, i) { u.id = g.id + '-u' + (i + 1); });
  });
});

// 为“句子缺失”的英语单元自动补充简单跟读句（基于单元核心词），让“跟我读”阶段高年级也有句子可练
// 已自带 sentences 的单元（如一/二年级）不会被覆盖
(function () {
  const enSub = CURRICULUM.subjects.find(function (s) { return s.id === 'english'; });
  if (!enSub) return;
  const tpls = ['I like ', 'This is '];
  enSub.grades.forEach(function (g) {
    g.units.forEach(function (u) {
      if (!u.sentences || u.sentences.length === 0) {
        const ws = u.words || [];
        const a = ws[0] ? ws[0].en : '';
        const b = ws[1] ? ws[1].en : a;
        if (a) u.sentences = [(tpls[0] + a + '.'), (tpls[1] + b + '.')];
      }
    });
  });
})();

if (typeof window !== 'undefined') window.CURRICULUM = CURRICULUM;
if (typeof module !== 'undefined') module.exports = CURRICULUM;
