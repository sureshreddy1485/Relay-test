const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

console.log('=========================================');
console.log('📢 RELAY MESSAGE BROADCAST UTILITY');
console.log('=========================================');
console.log('📝 Enter your broadcast message below.');
console.log('Press Ctrl+C to cancel, or type "DONE" on a new line and press Enter to broadcast:');
console.log('-----------------------------------------');

let messageLines = [];

rl.on('line', (line) => {
  if (line.trim() === 'DONE') {
    processBroadcast();
  } else {
    messageLines.push(line);
  }
});

function processBroadcast() {
  const message = messageLines.join('\n').trim();

  if (!message) {
    console.log('❌ Broadcast cancelled: Message cannot be empty.');
    process.exit(0);
  }

  console.log('\n📢 Broadcasting message to all users via relay_bot...');
  try {
    // Pass message via env var to avoid escaping issues
    execSync(`node scripts/broadcast.js`, {
      cwd: './backend',
      stdio: 'inherit',
      env: { ...process.env, BROADCAST_MESSAGE: message }
    });
    console.log('✅ Broadcast sent successfully!');
  } catch (e) {
    console.log('❌ Failed to send broadcast.', e.message);
  }

  console.log('\n🎉 ALL DONE! Your broadcast has been sent.');
  process.exit(0);
}
