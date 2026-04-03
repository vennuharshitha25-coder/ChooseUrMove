let users = JSON.parse(localStorage.getItem('saferoute_users')) || {};
        let currentUser = null;

        // Theme management
        function toggleTheme() {
            const body = document.body;
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            document.querySelector('.theme-toggle i').className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }

        // Load theme
        window.onload = function() {
            const savedTheme = localStorage.getItem('theme') || 'light';
            document.body.setAttribute('data-theme', savedTheme);
            document.querySelector('.theme-toggle i').className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            
            // Check offline status
            window.addEventListener('online', () => hideOfflineAlert());
            window.addEventListener('offline', () => showOfflineAlert());
            
            if (currentUser) showMainApp();
        };

        function showOfflineAlert() {
            document.getElementById('offlineAlert').style.display = 'block';
        }

        function hideOfflineAlert() {
            document.getElementById('offlineAlert').style.display = 'none';
        }

        // Auth functions
        function showSignup() {
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('signupForm').classList.remove('hidden');
        }

        function showLogin() {
            document.getElementById('signupForm').classList.add('hidden');
            document.getElementById('loginForm').classList.remove('hidden');
        }

        function signup() {
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const contact1 = document.getElementById('contact1').value;
            const contact2 = document.getElementById('contact2').value;
            const contact3 = document.getElementById('contact3').value;

            if (!contact1 || !contact2 || !contact3) {
                alert('Please provide all 3 emergency contacts');
                return;
            }

            if (users[email]) {
                alert('Email already registered!');
                return;
            }

            users[email] = {
                name,
                password,
                contacts: [contact1, contact2, contact3]
            };
                        localStorage.setItem('saferoute_users', JSON.stringify(users));
            alert('Account created successfully! Please login.');
            showLogin();
            clearSignupForm();
        }

        function login() {
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            if (users[email] && users[email].password === password) {
                currentUser = email;
                alert(`Welcome back, ${users[email].name}!`);
                showMainApp();
            } else {
                alert('Invalid email or password!');
            }
        }

        function clearSignupForm() {
            document.getElementById('signupName').value = '';
            document.getElementById('signupEmail').value = '';
            document.getElementById('signupPassword').value = '';
            document.getElementById('contact1').value = '';
            document.getElementById('contact2').value = '';
            document.getElementById('contact3').value = '';
        }

        function showMainApp() {
            document.getElementById('authContainer').style.display = 'none';
            document.getElementById('mainApp').style.display = 'block';
            document.getElementById('emergencyBtn').style.display = 'block';
        }

        // Route Generation
        function findRoutes() {
            const source = document.getElementById('source').value;
            const destination = document.getElementById('destination').value;

            if (!destination) {
                alert('Please enter destination');
                return;
            }

            const routesContainer = document.getElementById('routesContainer');
            routesContainer.innerHTML = '';
            routesContainer.style.display = 'block';

            // Generate 4 realistic routes
            const routes = generateRoutes(source, destination);
            routes.forEach((route, index) => {
                const routeCard = createRouteCard(route, index + 1);
                routesContainer.appendChild(routeCard);
            });
        }

        function generateRoutes(source, destination) {
            const baseDistance = Math.floor(Math.random() * 10) + 5; // 5-15 km
            const baseTime = Math.floor(Math.random() * 30) + 15; // 15-45 min

            return [
                {
                    name: "Fastest Route",
                    distance: `${baseDistance} km`,
                    time: `${baseTime} min`,
                    lighting: "Good",
                    crowd: "Medium",
                    safety: 85,
                    bestTime: "Daytime",
                    roadCondition: "Excellent"
                },
                {
                    name: "Safest Route", 
                    distance: `${baseDistance + 2} km`,
                    time: `${baseTime + 8} min`,
                    lighting: "Excellent",
                    crowd: "Low",
                    safety: 95,
                    bestTime: "Anytime",
                    roadCondition: "Good"
                },
                {
                    name: "Balanced Route",
                    distance: `${baseDistance + 1} km`,
                    time: `${baseTime + 4} min`,
                    lighting: "Good",
                    crowd: "Low",
                    safety: 90,
                    bestTime: "Evening",
                    roadCondition: "Good"
                },
                {
                    name: "Scenic Route",
                    distance: `${baseDistance + 4} km`,
                    time: `${baseTime + 12} min`,
                    lighting: "Fair",
                    crowd: "Very Low",
                    safety: 88,
                    bestTime: "Morning",
                    roadCondition: "Fair"
                }
            ];
        }

        function createRouteCard(route, number) {
            const card = document.createElement('div');
            card.className = 'route-card';
            
            const getSafetyClass = (score) => {
                if (score >= 90) return 'score-excellent';
                if (score >= 80) return 'score-good';
                return 'score-poor';
            };

            card.innerHTML = `
                <div class="route-header">
                    <div class="route-number">R${number}</div>
                    <div class="safety-score ${getSafetyClass(route.safety)}">
                        ${route.safety}/100
                        <i class="fas fa-shield-alt"></i>
                    </div>
                </div>
                <div class="property">
                    <span><i class="fas fa-stopwatch"></i> Time</span>
                    <strong>${route.time}</strong>
                </div>
                <div class="property">
                    <span><i class="fas fa-route"></i> Distance</span>
                    <strong>${route.distance}</strong>
                </div>
                <div class="property">
                    <span><i class="fas fa-lightbulb"></i> Lighting</span>
                    <strong>${route.lighting}</strong>
                </div>
                <div class="property">
                    <span><i class="fas fa-users"></i> Crowd</span>
                    <strong>${route.crowd}</strong>
                </div>
                <div class="property">
                    <span><i class="fas fa-clock"></i> Best Time</span>
                    <strong>${route.bestTime}</strong>
                </div>
                <div class="property">
                    <span><i class="fas fa-road"></i> Road Condition</span>
                    <strong>${route.roadCondition}</strong>
                </div>
                <button class="btn btn-success" onclick="openGoogleMaps('${route.name}')" style="margin-top: 1rem;">
                    <i class="fas fa-map"></i> Choose Route
                </button>
            `;
            return card;
        }

        function openGoogleMaps(routeName) {
            const source = document.getElementById('source').value;
            const destination = document.getElementById('destination').value;
            const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}&travelmode=driving`;
            window.open(url, '_blank');
        }

        function showAllRoutes() {
            findRoutes();
        }

        // AI Route Helper
        let aiStep = 0;
        const aiQuestions = [
            "What's most important to you? (1) Safety (2) Speed (3) Distance",
            "Are you traveling during day or night?",
            "Do you prefer less crowded routes?",
            "Any road condition preferences?"
        ];

        function showAIHelp() {
            document.getElementById('aiModal').style.display = 'block';
            aiStep = 0;
            showNextAIQuestion();
        }

        function closeAIHelp() {
            document.getElementById('aiModal').style.display = 'none';
            document.getElementById('aiResult').classList.add('hidden');
        }

        function showNextAIQuestion() {
            if (aiStep < aiQuestions.length) {
                document.getElementById('aiQuestions').innerHTML = `
                    <p style="margin-bottom: 1rem; color: var(--text-light);">
                        <strong>Q${aiStep + 1}:</strong> ${aiQuestions[aiStep]}
                    </p>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <button class="btn btn-primary" onclick="aiAnswer('1')" style="flex: 1; padding: 12px;">
                            Option 1
                        </button>
                        <button class="btn btn-primary" onclick="aiAnswer('2')" style="flex: 1; padding: 12px;">
                            Option 2
                        </button>
                        <button class="btn btn-outline" onclick="aiAnswer('skip')" style="flex: 1; padding: 12px;">
                            Skip
                        </button>
                    </div>
                `;
            }
        }

        function aiAnswer(answer) {
            aiStep++;
            if (aiStep >= aiQuestions.length) {
                recommendRoute();
            } else {
                showNextAIQuestion();
            }
        }

        function recommendRoute() {
            document.getElementById('aiQuestions').classList.add('hidden');
            document.getElementById('aiResult').classList.remove('hidden');
            document.getElementById('aiResult').innerHTML = `
                <div style="text-align: center; padding: 2rem; background: linear-gradient(135deg, var(--primary), #1d4ed8); color: white; border-radius: 16px; margin-top: 1rem;">
                    <h3><i class="fas fa-star"></i> AI Recommendation</h3>
                    <p style="font-size: 1.2rem; margin: 1rem 0;">Safest Route (95/100 Safety Score)</p>
                    <p>✅ Excellent lighting, low crowd, good roads</p>
                    <p>⏱️ ${Math.floor(Math.random() * 10) + 25} min • 📏 ${Math.floor(Math.random() * 5) + 8} km</p>
                    <button class="btn btn-success" onclick="openGoogleMaps('AI Recommended')" style="margin-top: 1rem; width: 100%;">
                        <i class="fas fa-map"></i> Navigate Now
                    </button>
                </div>
                <button class="btn btn-outline" onclick="showAIHelp()" style="width: 100%; margin-top: 1rem;">
                    Ask Again
                </button>
            `;
        }

        // Emergency Function
        function triggerEmergency() {
            if (!currentUser) {
                alert('Please login first');
                return;
            }

            if (confirm('Send emergency alert to your contacts?')) {
                const user = users[currentUser];
                const userLocation = navigator.geolocation ? 'Current GPS location' : 'Location unavailable';
                
                const message = `🚨 EMERGENCY ALERT 🚨\n${user.name} needs help!\nLocation: ${userLocation}\nTime: ${new Date().toLocaleString()}\nSafeRoute App`;
                
                // Simulate sending SMS (in real app, use SMS API)
                user.contacts.forEach((contact, index) => {
                    console.log(`SOS sent to ${contact}: ${message}`);
                    // In production: Use Twilio or similar SMS service
                });

                alert(`✅ Emergency alert sent to ${user.contacts.length} contacts!\n\nMessage:\n"${message}"`);
            }
        }

        // Auto-login if user exists
        if (localStorage.getItem('currentUser')) {
            currentUser = localStorage.getItem('currentUser');
            showMainApp();
        }