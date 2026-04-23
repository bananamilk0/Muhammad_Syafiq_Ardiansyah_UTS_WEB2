// Authentication module

function getUsers() {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
}

function setUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

function register(name, email, password) {
  const users = getUsers();

  // Validate
  if (!name || name.trim().length < 2) {
    return { success: false, message: 'Nama harus minimal 2 karakter.' };
  }
  if (!email || !isValidEmail(email)) {
    return { success: false, message: 'Format email tidak valid.' };
  }
  if (!password || password.length < 6) {
    return { success: false, message: 'Password harus minimal 6 karakter.' };
  }

  // Check unique email
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return { success: false, message: 'Email sudah terdaftar. Silakan login.' };
  }

  const newUser = {
    id: Date.now().toString(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: password,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  setUsers(users);

  return { success: true, user: newUser };
}

function login(email, password) {
  const users = getUsers();

  if (!email || !password) {
    return { success: false, message: 'Email dan password harus diisi.' };
  }

  const user = users.find(
    u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
  );

  if (!user) {
    return { success: false, message: 'Email atau password salah.' };
  }

  return { success: true, user };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Handle login form
function initLoginPage() {
  // Redirect if already logged in
  const user = getCurrentUser();
  if (user) {
    window.location.href = 'home.html';
    return;
  }

  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const btn = document.getElementById('loginBtn');

    // Loading state
    btn.disabled = true;
    btn.innerHTML = `
      <svg class="animate-spin w-5 h-5 mr-2 inline" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
      Masuk...
    `;

    setTimeout(() => {
      const result = login(email, password);

      if (result.success) {
        setCurrentUser(result.user);
        toast.success('Selamat datang, ' + result.user.name + '! 🍵');
        setTimeout(() => {
          window.location.href = 'home.html';
        }, 800);
      } else {
        toast.error(result.message);
        btn.disabled = false;
        btn.innerHTML = 'Masuk';
        // Shake animation on error
        form.classList.add('shake');
        setTimeout(() => form.classList.remove('shake'), 500);
      }
    }, 600);
  });

  // Demo login button
  const demoBtn = document.getElementById('demoLoginBtn');
  if (demoBtn) {
    demoBtn.addEventListener('click', () => {
      // Create demo user if not exists
      const users = getUsers();
      if (!users.find(u => u.email === 'demo@matchashop.com')) {
        register('Demo User', 'demo@matchashop.com', 'demo123');
      }
      document.getElementById('email').value = 'demo@matchashop.com';
      document.getElementById('password').value = 'demo123';
      toast.info('Kredensial demo telah diisi!');
    });
  }
}

// Handle register form
function initRegisterPage() {
  // Redirect if already logged in
  const user = getCurrentUser();
  if (user) {
    window.location.href = 'home.html';
    return;
  }

  const form = document.getElementById('registerForm');
  if (!form) return;

  // Real-time validation
  const passwordInput = document.getElementById('password');
  const confirmInput = document.getElementById('confirmPassword');
  const strengthBar = document.getElementById('passwordStrength');

  if (passwordInput) {
    passwordInput.addEventListener('input', function() {
      const val = this.value;
      let strength = 0;
      if (val.length >= 6) strength++;
      if (val.length >= 10) strength++;
      if (/[A-Z]/.test(val)) strength++;
      if (/[0-9]/.test(val)) strength++;
      if (/[^A-Za-z0-9]/.test(val)) strength++;

      if (strengthBar) {
        const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500'];
        const widths = ['w-1/5', 'w-2/5', 'w-3/5', 'w-4/5', 'w-full'];
        strengthBar.className = `h-1 rounded transition-all duration-300 ${colors[strength - 1] || 'bg-gray-200'} ${widths[strength - 1] || 'w-0'}`;
      }
    });
  }

  if (confirmInput) {
    confirmInput.addEventListener('input', function() {
      const matchMsg = document.getElementById('passwordMatchMsg');
      if (matchMsg) {
        if (this.value && this.value !== passwordInput.value) {
          matchMsg.textContent = 'Password tidak cocok';
          matchMsg.className = 'text-xs text-red-500 mt-1';
        } else if (this.value && this.value === passwordInput.value) {
          matchMsg.textContent = 'Password cocok ✓';
          matchMsg.className = 'text-xs text-green-500 mt-1';
        } else {
          matchMsg.textContent = '';
        }
      }
    });
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const btn = document.getElementById('registerBtn');

    if (password !== confirmPassword) {
      toast.error('Password dan konfirmasi password tidak cocok.');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = `
      <svg class="animate-spin w-5 h-5 mr-2 inline" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
      Mendaftar...
    `;

    setTimeout(() => {
      const result = register(name, email, password);

      if (result.success) {
        setCurrentUser(result.user);
        toast.success('Akun berhasil dibuat! Selamat datang 🎉');
        setTimeout(() => {
          window.location.href = 'home.html';
        }, 1000);
      } else {
        toast.error(result.message);
        btn.disabled = false;
        btn.innerHTML = 'Daftar Sekarang';
      }
    }, 600);
  });
}
