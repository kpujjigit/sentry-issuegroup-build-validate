// Initialize Sentry for error monitoring, performance tracking, profiling and session replay
Sentry.init({
  dsn: window.SENTRY_DSN,
  org: window.SENTRY_ORG,
  project: window.SENTRY_PROJECT,
  integrations: [
    new Sentry.BrowserTracing({ tracePropagationTargets: ["localhost"] }),
    new Sentry.Replay(),
    new Sentry.ProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
});

const matcherOptions = [
  'error.type','error.value','message','logger','level',
  'tags.tag','stack.abs_path','stack.module','stack.function','stack.package',
  'family','app'
];

function addMatcherRow() {
  const idx = document.querySelectorAll('.matcherRow').length;
  const row = document.createElement('div');
  row.className = 'matcherRow';
  row.innerHTML = `<select class="matcher" data-idx="${idx}">
    ${matcherOptions.map(m=>`<option value="${m}">${m}</option>`).join('')}
  </select>
  <input type="text" class="expression" placeholder="expression">`;
  document.getElementById('matchers').appendChild(row);
}

document.getElementById('addMatcher').onclick = addMatcherRow;
addMatcherRow();

function buildRule(e) {
  const span = Sentry.startSpan({ op: 'function', description: 'buildRule' });
  e.preventDefault();
  const matchers = [];
  document.querySelectorAll('.matcherRow').forEach(row => {
    const m = row.querySelector('.matcher').value;
    const exp = row.querySelector('.expression').value;
    if(m && exp) matchers.push(`${m}:${exp}`);
  });
  const fingerprint = document.getElementById('fingerprint').value.trim();
  const ruleName = document.getElementById('ruleName').value.trim();
  let line = matchers.join(' ');
  if(fingerprint) line += ` -> ${fingerprint}`;
  if(ruleName) line = `# ${ruleName}\n` + line;
  document.getElementById('builtRule').textContent = line;
  span.finish();
}

document.getElementById('builderForm').addEventListener('submit', buildRule);

document.getElementById('rulesInput').addEventListener('input', runValidation);

const allowedMatchers = new Set([
  'error.type', 'type',
  'error.value', 'value',
  'message', 'logger', 'level',
  'tags.tag',
  'stack.abs_path', 'path',
  'stack.module', 'module',
  'stack.function', 'function',
  'stack.package', 'package',
  'family', 'app'
]);

function validateRule(line) {
  const result = {status:'valid', message:''};
  line = line.trim();
  if(!line || line.startsWith('#')) { result.status='comment'; return result; }
  const parts = line.split('->');
  if(parts.length!==2) { result.status='invalid'; result.message='Missing `->`'; return result; }
  const [left,right] = parts.map(p=>p.trim());
  const tokens = left.split(/\s+/);
  for(const token of tokens) {
    const [m,exp] = token.split(':');
    if(!exp) {
      result.status='invalid';
      result.message = `Missing expression for ${m}`;
      return result;
    }
    if(!allowedMatchers.has(m)) {
      result.status = 'invalid';
      result.message = `Unknown matcher ${m}`;
      return result;
    }
  }
  if(!right) { result.status='invalid'; result.message='Missing fingerprint'; return result; }
  // Improvement: suggest default variable if not using it
  if(!right.includes('{{ default }}')) {
    result.status='improve';
    result.message='Consider adding {{ default }} to refine existing grouping';
  }
  result.explanation = `Groups events where ${left} and assigns fingerprint ${right}`;
  return result;
}

function runValidation() {
  const span = Sentry.startSpan({ op: 'function', description: 'runValidation' });
  const input = document.getElementById('rulesInput').value.split(/\n+/);
  const out = document.getElementById('validationOutput');
  out.innerHTML='';
  input.forEach((line,i)=>{
    const res = validateRule(line);
    if(res.status==='comment') return;
    const div=document.createElement('div');
    div.textContent=line;
    if(res.status==='valid') div.className='valid';
    else if(res.status==='invalid') div.className='invalid';
    else div.className='improve';
    div.title=res.status==='valid'?res.explanation:res.message;
    out.appendChild(div);
  });
  span.finish();
}

// theme toggle
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.dataset.theme = savedTheme;
const themeToggleBtn = document.getElementById('themeToggle');
if (themeToggleBtn) {
  themeToggleBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  themeToggleBtn.addEventListener('click', () => {
    const newTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    document.body.dataset.theme = newTheme;
    themeToggleBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('theme', newTheme);
  });
}

