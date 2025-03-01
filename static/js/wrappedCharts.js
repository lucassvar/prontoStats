// Load Google Charts library
google.charts.load('current', { packages: ['corechart'] });
google.charts.setOnLoadCallback(drawCharts); // Ensure all charts are drawn after the library loads


// Function to draw all charts
function drawCharts(data, userInput) {
    topReleases(data.top6_releases, userInput);
    topMovies(data.top6_movies, userInput);
    displayStats(data.display_stats, userInput);
    moviesPerDay(data.day_summaries, userInput);
    weeklyWatched(data.weekly_summaries, userInput);
    weeklyRatings(data.weekly_summaries, userInput);
    genresWatched(data.genres_counts, userInput);
    genresRated(data.genres_ratings, userInput);
    countriesWatched(data.countries_counts, userInput);
    countriesRated(data.countries_ratings, userInput);
    languagesWatched(data.languages_counts, userInput);
    languagesRated(data.languages_ratings, userInput);
    actorsWatched(data.actors_watched, userInput);
    actorsRated(data.actors_rated, userInput);
    directorsWatched(data.directors_watched, userInput);
    directorsRated(data.directors_rated, userInput);
    ratingStars(data.ratings_count, userInput);
    releasesProportions(data.releases_proportion, userInput);
    positiveDiff(data.highest_diffs, userInput);
    negativeDiff(data.lowest_diffs, userInput);
    high_low_movies(data.high_low_data, userInput);
    // prontoMovies(data.pronto_data);
    movieMap(data.all_countries, userInput);
}


// PLOT: Top Releases of the Year
let topReleasesChart = null; // Global variable to store the chart instance
function topReleases(user_data, selectedUser) {
    // Destroy existing chart instance if it exists
    if (topReleasesChart) {
        topReleasesChart.destroy();
    }

    const container = document.getElementById('topReleases_id'); // Get the container element

    if (!container) {
        console.error('Element with id "topReleases_id" not found.');
        return; // Stop execution if container doesn't exist
    }

    // Clear previous content
    container.innerHTML = '';

    // Create a new div for each movie
    user_data.forEach(item => {
        const movieDiv = document.createElement('div');
        movieDiv.style.display = 'inline-block';
        movieDiv.style.margin = '20px';
        movieDiv.style.textAlign = 'center';

        // Create an anchor tag for the clickable link
        const link = document.createElement('a');
        link.href = item.film_url; // Set the film URL
        link.target = '_blank'; // Open in a new tab/window

        const img = document.createElement('img');
        img.src = item.poster_url;
        img.style.width = '100px';
        img.style.height = '150px';
        img.style.display = 'block';

        const rating = document.createElement('div');
        rating.textContent = item.rating;
        rating.style.marginTop = '5px';
        rating.style.color = '#131313'; // Change rating color to a darker grey

        // Append the image to the link
        link.appendChild(img);

        // Append the link and rating to the movie div
        movieDiv.appendChild(link);
        movieDiv.appendChild(rating);

        // Append the movie div to the container
        container.appendChild(movieDiv);
    });
}



// PLOT: Top Movies of the Year
let topMoviesChart = null; // Global variable to store the chart instance
function topMovies(user_data, selectedUser) {
    // Destroy existing chart instance if it exists
    if (topMoviesChart) {
        topMoviesChart.destroy();
    }

    const container = document.getElementById('topMovies_id'); // Get the container element

    if (!container) {
        console.error('Element with id "topMovies_id" not found.');
        return; // Stop execution if container doesn't exist
    }

    // Clear previous content
    container.innerHTML = '';

    // Create a new div for each movie
    user_data.forEach(item => {
        const movieDiv = document.createElement('div');
        movieDiv.style.display = 'inline-block';
        movieDiv.style.margin = '20px';
        movieDiv.style.textAlign = 'center';

        // Create an anchor tag for the clickable link
        const link = document.createElement('a');
        link.href = item.film_url; // Set the film URL
        link.target = '_blank'; // Open in a new tab/window

        const img = document.createElement('img');
        img.src = item.poster_url;
        img.style.width = '100px';
        img.style.height = '150px';
        img.style.display = 'block';

        const rating = document.createElement('div');
        rating.textContent = item.rating;
        rating.style.marginTop = '5px';
        rating.style.color = '#131313'; // Change rating color to a darker grey

        // Append the image to the link
        link.appendChild(img);

        // Append the link and rating to the movie div
        movieDiv.appendChild(link);
        movieDiv.appendChild(rating);

        // Append the movie div to the container
        container.appendChild(movieDiv);
    });
}



// PLOT: Display stats
function displayStats(user_data, selectedUser) {
    const container = document.getElementById('displayStats_id');

    if (!container) {
        console.error('Element with id "displayStats_id" not found.');
        return; // Stop execution if container doesn't exist
    }

    // Clear any existing content in the container
    container.innerHTML = '';

    user_data.forEach(data => {
        // Create a div for each set of stats
        const statsDiv = document.createElement('div');
        statsDiv.style.padding = '10px';
        statsDiv.style.textAlign = 'center';

        // Create a Pelis element
        const pelis = document.createElement('div');
        pelis.innerHTML = `<span style="color: #131313; font-weight: bold; font-size: 30px;">${data.diary_logs}</span><br><span style="color: #707070; font-size: 10px;">Pelis</span>`;
        statsDiv.appendChild(pelis);

        // Create a rewatchs element
        const rewatchs = document.createElement('div');
        rewatchs.innerHTML = `<span style="color: #131313; font-weight: bold; font-size: 30px;">${data.rewatchs}</span><br><span style="color: #707070; font-size: 10px;">Rewatches</span>`;
        rewatchs.style.paddingTop = '20px';
        statsDiv.appendChild(rewatchs);

        // Create a Horas element
        const horas = document.createElement('div');
        horas.innerHTML = `<span style="color: #131313; font-weight: bold; font-size: 30px;">${data.hours_watched}</span><br><span style="color: #707070; font-size: 10px;">Horas</span>`;
        horas.style.paddingTop = '20px';
        statsDiv.appendChild(horas);

        // Append stats div to the container
        container.appendChild(statsDiv);
    });
}


// PLOT: Movies watched per day of the week
let userDaysChart = null; // Global variable to store the chart instance
function moviesPerDay(user_data, selectedUser) {
    // Destroy existing chart instance if it exists
    if (userDaysChart) {
        userDaysChart.destroy();
    }

    // Create a new chart instance
    userDaysChart = new Chart(
        document.getElementById("userDays_id"),
        {
            type: 'bar',
            data: {
                labels: user_data.map(row => row.day),
                datasets: [
                    {
                        data: user_data.map(row => row.count),
                        backgroundColor: 'rgba(0, 0, 0, 0.69)',
                        hoverBackgroundColor: '#DC7283',
                        borderWidth: 0
                    }
                ]
            },
            options: {
                title: {
                    display: false
                },
                legend: { display: false },
                responsive: true,
                maintainAspectRatio: false,
                aspectRatio: window.innerWidth <= 768 ? 1.5 : 2.5,
                scales: {
                    yAxes: [{
                        ticks: { display: false, beginAtZero: true }, // Remove y-axis text
                        gridLines: { display: false } // Remove y-axis grid lines
                    }],
                    xAxes: [{
                        ticks: { mirror: true, fontColor: '#131313', fontFamily: 'Arial' }, // Change x-axis text color and font
                        gridLines: { display: false } // Remove x-axis grid lines
                    }]
                },
                tooltips: {
                    callbacks: {
                        // Customizes the title to display full day names
                        title: function(tooltipItems, data) {
                            const dayMap = {
                                'Lu': 'Lunes',
                                'Ma': 'Martes',
                                'Mi': 'Miércoles',
                                'Ju': 'Jueves',
                                'Vi': 'Viernes',
                                'Sá': 'Sábado',
                                'Do': 'Domingo'
                            };
                            const dayAbbrev = tooltipItems[0].label;
                            return dayMap[dayAbbrev] || dayAbbrev;
                        },
                        // Customizes the label to append "pelis" and removes the color box
                        label: function(tooltipItem, data) {
                            const value = tooltipItem.value;
                            return `${value} pelis`;
                        }
                    },
                    // Disables the color box in the tooltip
                    displayColors: false
                },
                layout: { padding: 20 }
            }
        }
    );
}


// PLOT: Movies watched per week
let weeklyWatchedChart = null; // Global variable to store the chart instance
function weeklyWatched(user_data, selectedUser) {
    // Destroy existing chart instance if it exists
    if (weeklyWatchedChart) {
        weeklyWatchedChart.destroy();
    }

    // Create a new chart instance
    const ctx = document.getElementById('weeklyWatched_id').getContext('2d');

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0); // Horizontal gradient
    gradient.addColorStop(0, '#00e054'); // Start color
    gradient.addColorStop(1, '#40bcf4'); // End color

    weeklyWatchedChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: user_data.map(row => row.week_number),
            datasets: [
                {
                    data: user_data.map(row => row.weekly_quantity),
                    backgroundColor: gradient, // Apply gradient
                    hoverBackgroundColor: '#556678',
                    borderWidth: 0
                }
            ]
        },
        options: {
            title: {
                display: false
            },
            legend: { display: false },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: { display: false, beginAtZero: true }, // Remove y-axis text
                    gridLines: { display: false } // Remove y-axis grid lines
                }],
                xAxes: [{
                    ticks: { display: false }, // Remove x-axis grid lines
                    gridLines: { display: false } // Remove x-axis grid lines
                }]
            },
            tooltips: {
                callbacks: {
                    title: function(tooltipItem, data) {
                        const value = data.datasets[tooltipItem[0].datasetIndex].data[tooltipItem[0].index];
                        if (value <= 1) {
                            return `${value} Peli`;
                        } else {
                            return `${value} Pelis`;
                        }
                    },
                    label: function(tooltipItem, data) {
                        const weekNumber = data.labels[tooltipItem.index];
                        const weekRange = user_data[tooltipItem.index].week_range;
                        const arrayLines = [`Sem. ${weekNumber}`, `${weekRange}`];
                        return arrayLines;
                    }
                },
                displayColors: false
            },
            layout: { padding: 20 },
            onClick: function(event) {
                // Detect if the device is mobile
                const isMobile = /Mobi|Android/i.test(navigator.userAgent);

                if (isMobile) {
                    console.log('Click disabled on mobile devices.');
                    return; // Do nothing if it's a mobile device
                }

                // Get the clicked element
                const activePoints = weeklyWatchedChart.getElementsAtEventForMode(event, 'nearest', { intersect: true });

                // Log the entire activePoints object to understand its structure
                console.log('Active Points:', activePoints);

                if (activePoints.length > 0) {
                    // Log the properties of the clicked element to verify how to extract the index
                    console.log('Clicked Element:', activePoints[0]);

                    const clickedIndex = activePoints[0]._index; // Get the index using _index (sometimes .index might not work)
                    console.log('Clicked Index:', clickedIndex); // Debug the clicked index

                    // Check if the index is within the bounds of user_data
                    if (clickedIndex >= 0 && clickedIndex < user_data.length) {
                        const clickedWeekNumber = user_data[clickedIndex].week_number; // Get the corresponding week number
                        console.log('Clicked Week Number:', clickedWeekNumber); // Debug week_number

                        // Ensure selectedUser and clickedWeekNumber are valid
                        if (selectedUser && clickedWeekNumber) {
                            // Construct the URL
                            const url = `https://letterboxd.com/${selectedUser}/films/diary/for/2024/week/${clickedWeekNumber}/`;

                            // Log the generated URL
                            console.log('Generated URL:', url);

                            // Open the URL in a new tab/window
                            window.open(url, '_blank');
                        } else {
                            console.error('Selected user or week number is missing.');
                        }
                    } else {
                        console.error('Clicked index is out of bounds.');
                    }
                } else {
                    console.error('No active points found on click.');
                }
            }
        }
    });
}


// PLOT: Movies watched per week
let weeklyRatingsChart = null; // Global variable to store the chart instance
function weeklyRatings(user_data, selectedUser) {
    // Destroy existing chart instance if it exists
    if (weeklyRatingsChart) {
        weeklyRatingsChart.destroy();
    }

    // Create a new chart instance
    const ctx = document.getElementById('weeklyRated_id').getContext('2d');

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0); // Horizontal gradient
    gradient.addColorStop(0, '#00e054'); // Start color
    gradient.addColorStop(1, '#40bcf4'); // End color

    weeklyRatingsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: user_data.map(row => row.week_number),
            datasets: [
                {
                    data: user_data.map(row => row.avg_weekly_rating),
                    backgroundColor: gradient, // Apply gradient
                    hoverBackgroundColor: '#556678', // Hover color
                    borderWidth: 0
                }
            ]
        },
        options: {
            title: {
                display: false
            },
            legend: { display: false },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: { display: false, beginAtZero: true }, // Remove y-axis text
                    gridLines: { display: false } // Remove y-axis grid lines
                }],
                xAxes: [{
                    ticks: { display: false }, // Remove x-axis grid lines
                    gridLines: { display: false } // Remove x-axis grid lines
                }]
            },
            tooltips: {
                callbacks: {
                    title: function(tooltipItem, data) {
                        const value = data.datasets[tooltipItem[0].datasetIndex].data[tooltipItem[0].index];
                        return `${value} ★`;
                    },
                    label: function(tooltipItem, data) {
                        const weekNumber = data.labels[tooltipItem.index];
                        const weekRange = user_data[tooltipItem.index].week_range;
                        const arrayLines = [`Sem. ${weekNumber}`, `${weekRange}`];
                        return arrayLines;
                    }
                },
                displayColors: false
            },
            layout: { padding: 20 },
            onClick: function(event) {
                // Mobile detection logic
                const isMobile = /Mobi|Android/i.test(navigator.userAgent);
                if (isMobile) {
                    console.log("Click functionality disabled on mobile devices");
                    return; // Prevent URL redirection on mobile
                }

                // Get the clicked element
                const activePoints = weeklyRatingsChart.getElementsAtEventForMode(event, 'nearest', { intersect: true });

                // Log the entire activePoints object to understand its structure
                console.log('Active Points:', activePoints);

                if (activePoints.length > 0) {
                    // Log the properties of the clicked element to verify how to extract the index
                    console.log('Clicked Element:', activePoints[0]);

                    const clickedIndex = activePoints[0]._index; // Get the index using _index (sometimes .index might not work)
                    console.log('Clicked Index:', clickedIndex); // Debug the clicked index

                    // Check if the index is within the bounds of user_data
                    if (clickedIndex >= 0 && clickedIndex < user_data.length) {
                        const clickedWeekNumber = user_data[clickedIndex].week_number; // Get the corresponding week number
                        console.log('Clicked Week Number:', clickedWeekNumber); // Debug week_number

                        // Ensure selectedUser and clickedWeekNumber are valid
                        if (selectedUser && clickedWeekNumber) {
                            // Construct the URL
                            const url = `https://letterboxd.com/${selectedUser}/films/diary/for/2024/week/${clickedWeekNumber}/`;

                            // Log the generated URL
                            console.log('Generated URL:', url);

                            // Open the URL in a new tab/window
                            window.open(url, '_blank');
                        } else {
                            console.error('Selected user or week number is missing.');
                        }
                    } else {
                        console.error('Clicked index is out of bounds.');
                    }
                } else {
                    console.error('No active points found on click.');
                }
            }
        }
    });
}


// PLOT: Most watched GENRES
let genresWatchedChart = null; // Global variable to store the chart instance
function genresWatched(user_data, selectedUser){
    // Create a new chart instance
    const ctx = document.getElementById('genresWatched_id').getContext('2d');
    genresWatchedChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: user_data.map(data => data.genre),
            datasets: [{
                label: 'Watch Count',
                data: user_data.map(data => data.watch_count),
                backgroundColor: 'rgba(0, 0, 0, 0.69)',
                hoverBackgroundColor: '#DC7283',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 0,
                barThickness: 20
            }]
        },
        options: {
            title: {
                display: false
            },
            legend: { display: false },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: { display : true, fontColor: '#131313', fontFamily: 'Arial' }, // Remove y-axis text
                    gridLines: { display: false } // Remove y-axis grid lines
                }],
                xAxes: [{
                    ticks: { display: false, beginAtZero: true }, // Remove x-axis grid lines
                    gridLines: { display: false } // Remove x-axis grid lines
                }]
            },
            tooltips: {
                callbacks: {
                    title: function() {},
                    label: function(tooltipItem, data) {
                        console.log('tooltipItem:', tooltipItem);
                        console.log('data:', data);
                        const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                        return `${value} Pelis`;
                    }
                },
                displayColors: false
            },
            layout: { padding: 20 }
        }
    });
}


// PLOT: Highest rated GENRES
let genresRatedChart = null; // Global variable to store the chart instance
function genresRated(user_data, selectedUser){
    // Create a new chart instance
    const ctx = document.getElementById('genresRated_id').getContext('2d');
    genresRatedChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: user_data.map(data => data.genre),
            datasets: [{
                label: 'Watch Count',
                data: user_data.map(data => data.avg_user_rating),
                backgroundColor: 'rgba(0, 0, 0, 0.69)',
                hoverBackgroundColor: '#DC7283',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 0,
                barThickness: 20
            }]
        },
        options: {
            title: {
                display: false
            },
            legend: { display: false },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: { display : true, fontColor: '#131313', fontFamily: 'Arial' }, // Remove y-axis text
                    gridLines: { display: false } // Remove y-axis grid lines
                }],
                xAxes: [{
                    ticks: { display: false, beginAtZero: true }, // Remove x-axis grid lines
                    gridLines: { display: false } // Remove x-axis grid lines
                }]
            },
            tooltips: {
                callbacks: {
                    title: function() {},
                    label: function(tooltipItem, data) {
                        console.log('tooltipItem:', tooltipItem);
                        console.log('data:', data);
                        const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                        return `${value} ★`;
                    }
                },
                displayColors: false
            },
            layout: { padding: 20 }
        }
    });
}


// PLOT: Most watched COUNTRIES
let countriesWatchedChart = null; // Global variable to store the chart instance
function countriesWatched(user_data, selectedUser){
    // Create a new chart instance
    const ctx = document.getElementById('countriesWatched_id').getContext('2d');
    countriesWatchedChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: user_data.map(data => data.country),
            datasets: [{
                label: 'Watch Count',
                data: user_data.map(data => data.watch_count),
                backgroundColor: 'rgba(0, 0, 0, 0.69)',
                hoverBackgroundColor: '#DC7283',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 0,
                barThickness: 20
            }]
        },
        options: {
            title: {
                display: false
            },
            legend: { display: false },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: { display : true, fontColor: '#131313', fontFamily: 'Arial' }, // Remove y-axis text
                    gridLines: { display: false } // Remove y-axis grid lines
                }],
                xAxes: [{
                    ticks: { display: false, beginAtZero: true }, // Remove x-axis grid lines
                    gridLines: { display: false } // Remove x-axis grid lines
                }]
            },
            tooltips: {
                callbacks: {
                    title: function() {},
                    label: function(tooltipItem, data) {
                        console.log('tooltipItem:', tooltipItem);
                        console.log('data:', data);
                        const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                        return `${value} Pelis`;
                    }
                },
                displayColors: false
            },
            layout: { padding: 20 }
        }
    });
}


// PLOT: Highest rated COUNTRIES
let countriesRatedChart = null; // Global variable to store the chart instance
function countriesRated(user_data, selectedUser){
    // Create a new chart instance
    const ctx = document.getElementById('countriesRated_id').getContext('2d');
    countriesRatedChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: user_data.map(data => data.country),
            datasets: [{
                label: 'Watch Count',
                data: user_data.map(data => data.avg_user_rating),
                backgroundColor: 'rgba(0, 0, 0, 0.69)',
                hoverBackgroundColor: '#DC7283',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 0,
                barThickness: 20
            }]
        },
        options: {
            title: {
                display: false
            },
            legend: { display: false },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: { display : true, fontColor: '#131313', fontFamily: 'Arial' }, // Remove y-axis text
                    gridLines: { display: false } // Remove y-axis grid lines
                }],
                xAxes: [{
                    ticks: { display: false, beginAtZero: true }, // Remove x-axis grid lines
                    gridLines: { display: false } // Remove x-axis grid lines
                }]
            },
            tooltips: {
                callbacks: {
                    title: function() {},
                    label: function(tooltipItem, data) {
                        console.log('tooltipItem:', tooltipItem);
                        console.log('data:', data);
                        const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                        return `${value} ★`;
                    }
                },
                displayColors: false
            },
            layout: { padding: 20 }
        }
    });
}


// PLOT: Most watched LANGUAGES
let languagesWatchedChart = null; // Global variable to store the chart instance
function languagesWatched(user_data, selectedUser){
    // Destroy existing chart instance if it exists
    if (languagesWatchedChart) {
        languagesWatchedChart.destroy();
    }

    // Create a new chart instance
    const ctx = document.getElementById('languagesWatched_id').getContext('2d');
    languagesWatchedChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: user_data.map(data => data.language),
            datasets: [{
                label: 'Watch Count',
                data: user_data.map(data => data.watch_count),
                backgroundColor: 'rgba(0, 0, 0, 0.69)',
                hoverBackgroundColor: '#DC7283',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 0,
                barThickness: 20
            }]
        },
        options: {
            title: {
                display: false
            },
            legend: { display: false },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: { display : true, fontColor: '#131313', fontFamily: 'Arial' }, // Remove y-axis text
                    gridLines: { display: false } // Remove y-axis grid lines
                }],
                xAxes: [{
                    ticks: { display: false, beginAtZero: true }, // Remove x-axis grid lines
                    gridLines: { display: false } // Remove x-axis grid lines
                }]
            },
            tooltips: {
                callbacks: {
                    title: function() {},
                    label: function(tooltipItem, data) {
                        console.log('tooltipItem:', tooltipItem);
                        console.log('data:', data);
                        const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                        return `${value} Pelis`;
                    }
                },
                displayColors: false
            },
            layout: { padding: 20 }
        }
    });
}


// PLOT: Highest rated LANGUAGES
let languagesRatedChart = null; // Global variable to store the chart instance
function languagesRated(user_data, selectedUser){
    // Destroy existing chart instance if it exists
    if (languagesRatedChart) {
        languagesRatedChart.destroy();
    }

    // Create a new chart instance
    const ctx = document.getElementById('languagesRated_id').getContext('2d');
    languagesRatedChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: user_data.map(data => data.language),
            datasets: [{
                label: 'Watch Count',
                data: user_data.map(data => data.avg_user_rating),
                backgroundColor: 'rgba(0, 0, 0, 0.69)',
                borderColor: 'rgba(75, 192, 192, 1)',
                hoverBackgroundColor: '#DC7283',
                borderWidth: 0,
                barThickness: 20
            }]
        },
        options: {
            title: {
                display: false
            },
            legend: { display: false },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: { display : true, fontColor: '#131313', fontFamily: 'Arial' }, // Remove y-axis text
                    gridLines: { display: false } // Remove y-axis grid lines
                }],
                xAxes: [{
                    ticks: { display: false, beginAtZero: true }, // Remove x-axis grid lines
                    gridLines: { display: false } // Remove x-axis grid lines
                }]
            },
            tooltips: {
                callbacks: {
                    title: function() {},
                    label: function(tooltipItem, data) {
                        console.log('tooltipItem:', tooltipItem);
                        console.log('data:', data);
                        const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                        return `${value} ★`;
                    }
                },
                displayColors: false
            },
            layout: { padding: 20 }
        }
    });
}


// PLOT: Highest watched ACTORS
function actorsWatched(user_data, selectedUser) {
    console.log("Debug: actorsWatched called with", user_data);
    const container = document.getElementById('actorsWatched_id');
    if (!container) {
        console.error('Debug: Element with id "actorsWatched_id" not found.');
        return;
    }
    container.innerHTML = '';
    user_data.forEach(data => {
        console.log("Debug: Processing actor", data);
        // Wrangle the URL
        const fullUrl = `https://letterboxd.com/${selectedUser}/films/diary/for/2024/with${data.person_lboxd_url}`;
        // Create a div for each actor
        const actorDiv = document.createElement('div');
        actorDiv.style.display = 'inline-block';
        actorDiv.style.textAlign = 'center';
        actorDiv.style.margin = '10px';
        actorDiv.style.padding = '10px';
        // Create an anchor tag for the clickable link
        const link = document.createElement('a');
        link.href = fullUrl;
        link.target = '_blank';
        // Create an image element
        const img = document.createElement('img');
        img.src = data.url;
        img.style.width = '100px';
        img.style.height = '100px';
        img.style.borderRadius = '50%';
        img.style.objectFit = 'cover';
        link.appendChild(img);
        // Create a name element
        const name = document.createElement('div');
        name.textContent = data.name;
        name.style.fontWeight = 'bold';
        name.style.color = '#131313';
        name.style.fontSize = '12px';
        // Create a watch count element
        const watchCount = document.createElement('div');
        watchCount.textContent = `${data.watch_count} Pelis`;
        watchCount.style.color = '#a1a1a1';
        watchCount.style.fontSize = '10px';
        // Append elements to the actor div
        actorDiv.appendChild(link);
        actorDiv.appendChild(name);
        actorDiv.appendChild(watchCount);
        container.appendChild(actorDiv);
    });
    console.log("Debug: actorsWatched completed.");
}


// PLOT: Highest watched ACTORS
function actorsRated(user_data, selectedUser) {
    console.log("Debug: actorsRated called with", user_data);
    const container = document.getElementById('actorsRated_id');
    if (!container) {
        console.error('Debug: Element with id "actorsRated_id" not found.');
        return;
    }
    container.innerHTML = '';
    user_data.forEach(data => {
        console.log("Debug: Processing actor", data);
        const fullUrl = `https://letterboxd.com/${selectedUser}/films/diary/for/2024/with${data.person_lboxd_url}`;
        const actorDiv = document.createElement('div');
        actorDiv.style.display = 'inline-block';
        actorDiv.style.textAlign = 'center';
        actorDiv.style.margin = '10px';
        actorDiv.style.padding = '10px';
        const link = document.createElement('a');
        link.href = fullUrl;
        link.target = '_blank';
        const img = document.createElement('img');
        img.src = data.url;
        img.style.width = '100px';
        img.style.height = '100px';
        img.style.borderRadius = '50%';
        img.style.objectFit = 'cover';
        link.appendChild(img);
        const name = document.createElement('div');
        name.textContent = data.name;
        name.style.fontWeight = 'bold';
        name.style.color = '#131313';
        name.style.fontSize = '12px';
        const avg_user_rating = document.createElement('div');
        avg_user_rating.textContent = `${data.avg_user_rating} ★`;
        avg_user_rating.style.color = '#a1a1a1';
        avg_user_rating.style.fontSize = '10px';
        actorDiv.appendChild(link);
        actorDiv.appendChild(name);
        actorDiv.appendChild(avg_user_rating);
        container.appendChild(actorDiv);
    });
    console.log("Debug: actorsRated completed.");
}


// PLOT: Highest watched DIRECTORS
function directorsWatched(user_data, selectedUser) {
    console.log("Debug: directorsWatched called with", user_data);
    const container = document.getElementById('directorsWatched_id');
    if (!container) {
        console.error('Debug: Element with id "directorsWatched_id" not found.');
        return;
    }
    container.innerHTML = '';
    user_data.forEach(data => {
        console.log("Debug: Processing director", data);
        const fullUrl = `https://letterboxd.com/${selectedUser}/films/diary/for/2024/with${data.person_lboxd_url}`;
        const directorDiv = document.createElement('div');
        directorDiv.style.display = 'inline-block';
        directorDiv.style.textAlign = 'center';
        directorDiv.style.margin = '10px';
        directorDiv.style.padding = '10px';
        const link = document.createElement('a');
        link.href = fullUrl;
        link.target = '_blank';
        const img = document.createElement('img');
        img.src = data.url;
        img.style.width = '100px';
        img.style.height = '100px';
        img.style.borderRadius = '50%';
        img.style.objectFit = 'cover';
        link.appendChild(img);
        const name = document.createElement('div');
        name.textContent = data.name;
        name.style.fontWeight = 'bold';
        name.style.color = '#131313';
        name.style.fontSize = '12px';
        const watchCount = document.createElement('div');
        watchCount.textContent = `${data.watch_count} Pelis`;
        watchCount.style.color = '#a1a1a1';
        watchCount.style.fontSize = '10px';
        directorDiv.appendChild(link);
        directorDiv.appendChild(name);
        directorDiv.appendChild(watchCount);
        container.appendChild(directorDiv);
    });
    console.log("Debug: directorsWatched completed.");
}


// PLOT: Highest watched DIRECTORS
function directorsRated(user_data, selectedUser) {
    console.log("Debug: directorsRated called with", user_data);
    const container = document.getElementById('directorsRated_id');

    if (!container) {
        console.error('Element with id "directorsRated_id" not found.');
        return; // Stop execution if container doesn't exist
    }

    // Clear any existing content in the container
    container.innerHTML = '';

    user_data.forEach(data => {
        // Wrangle the URL
        const fullUrl = `https://letterboxd.com/${selectedUser}/films/diary/for/2024/with${data.person_lboxd_url}`;

        // Create a div for each director
        const directorDiv = document.createElement('div');
        directorDiv.style.display = 'inline-block';
        directorDiv.style.textAlign = 'center';
        directorDiv.style.margin = '10px';
        directorDiv.style.padding = '10px';

        // Create an anchor tag for the clickable link
        const link = document.createElement('a');
        link.href = fullUrl; // Set the wrangled URL
        link.target = '_blank'; // Open in a new tab/window

        // Create an image element
        const img = document.createElement('img');
        img.src = data.url;
        img.style.width = '100px';
        img.style.height = '100px';
        img.style.borderRadius = '50%'; // Make the image circular
        img.style.objectFit = 'cover';

        // Append the image to the link
        link.appendChild(img);

        // Create a name element
        const name = document.createElement('div');
        name.textContent = data.name;
        name.style.fontWeight = 'bold';
        name.style.color = '#131313';
        name.style.fontSize = '12px';

        // Create an avg_user_rating element
        const avg_user_rating = document.createElement('div');
        avg_user_rating.textContent = `${data.avg_user_rating} ★`;
        avg_user_rating.style.color = '#a1a1a1';
        avg_user_rating.style.fontSize = '10px';

        // Append elements to the director div
        directorDiv.appendChild(link); // Append the clickable image
        directorDiv.appendChild(name);
        directorDiv.appendChild(avg_user_rating);

        // Append director div to the container
        container.appendChild(directorDiv);
    });
}


// PLOT: Movies watched per rating
let ratingStarsChart = null; // Global variable to store the chart instance
function ratingStars(user_data, selectedUser) {
    console.log("Debug: ratingStars called with", user_data);
    if (!document.getElementById("ratingStars_id")) {
        console.error("Debug: Canvas with id 'ratingStars_id' not found.");
        return;
    }
    if (ratingStarsChart) {
        ratingStarsChart.destroy();
        console.log("Debug: Previous ratingStarsChart destroyed.");
    }
    const ctx = document.getElementById("ratingStars_id").getContext('2d');
    console.log("Debug: ratingStars canvas context obtained.", ctx);
    ratingStarsChart = new Chart(
        document.getElementById("ratingStars_id"),
        {
            type: 'bar',
            data: {
                labels: user_data.map(row => row.rating),
                datasets: [
                    {
                        data: user_data.map(row => row.rating_count),
                        backgroundColor: '#131313', // Set bar color to #131313
                        hoverBackgroundColor: '#DC7283', // Hover color
                        borderWidth: 0
                    }
                ]
            },
            options: {
                title: {
                    display: false
                },
                legend: { display: false },
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: { display: false, beginAtZero: true }, // Remove y-axis text
                        gridLines: { display: false } // Remove y-axis grid lines
                    }],
                    xAxes: [{
                        ticks: { display: false }, // Remove x-axis text
                        gridLines: { display: false } // Remove x-axis grid lines
                    }]
                },
                tooltips: {
                    callbacks: {
                        title: function(tooltipItems, data) {
                            let index = tooltipItems[0].index;
                            return user_data[index].stars;
                        },
                        label: function(tooltipItem, data) {
                            let index = tooltipItem.index;
                            return user_data[index].rating_count + " Pelis";
                        }
                    },
                    // Disables the color box in the tooltip
                    displayColors: false
                },
                layout: { padding: 20 },
                onClick: function(evt, activeElements) {
                    // Prevent URL opening on mobile devices
                    if (isMobile) {
                        console.log('Click detected on mobile. URL will not open.');
                        evt.preventDefault(); // Prevent default action for mobile
                        return; // Stop further processing
                    }

                    // Proceed only if click occurs on a valid element
                    if (activeElements.length > 0) {
                        const datasetIndex = activeElements[0]._datasetIndex;
                        const index = activeElements[0]._index;
                        const rating = user_data[index].rating;
                        
                        // Construct the URL
                        const url = `https://letterboxd.com/${selectedUser}/films/diary/for/2024/rated/${rating}/`;
                        
                        // Log the generated URL
                        console.log('Generated URL:', url);
                        
                        // Navigate to the URL
                        window.open(url, '_blank'); // Opens in a new tab
                    }
                }
            }
        }
    );
}


// PLOT: proportion of RELEASES watched
let releasesProportionsChart = null; // Global variable to store the chart instance
function releasesProportions(user_data, selectedUser) {
    console.log("Debug: releasesProportions called with", user_data);
    if (releasesProportionsChart) {
        releasesProportionsChart.destroy();
        console.log("Debug: Previous releasesProportionsChart destroyed.");
    }

    // Filter data for 'Estrenos' and 'Viejas'
    const moviesData = user_data.filter(item => item.type_movie === 'Estrenos' || item.type_movie === 'Viejas');
    const totalData = user_data.find(item => item.type_movie === 'Total');

    // Extract labels and data for the chart
    const labels = moviesData.map(item => item.type_movie);
    const data = moviesData.map(item => item.movie_count);

    // Destroy existing chart instance if it exists
    if (releasesProportionsChart) {
        releasesProportionsChart.destroy();
    }

    releasesProportionsChart = new Chart(
        document.getElementById("releasesProportions_id"),
        {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: ['#A64253', '#131313'], // Colors for 'Viejas' and 'Estrenos'
                    hoverBackgroundColor: ['#DC7283', '#515151'], // Hover colors for 'Viejas' and 'Estrenos'
                    borderWidth: 1
                }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            tooltips: {
                callbacks: {
                    title: function(tooltipItems, data) {
                        const total = totalData.movie_count;
                        const value = data.datasets[0].data[tooltipItems[0].index];
                        const percentage = ((value / total) * 100).toFixed(2);
                        return `${percentage}%`;
                    },
                    label: function(tooltipItem, data) {
                        const value = data.datasets[0].data[tooltipItem.index];
                        return `${value} de ${totalData.movie_count}`;
                    }
                },
                displayColors: false
            },
            legend: {
                display: true,
                position: 'left',
                align: 'center'
            }
        }
        }
    );

    // Trigger a resize on window resize (this will help the chart resize dynamically)
    window.addEventListener('resize', function() {
        releasesProportionsChart.update();
    });
}


// PLOT: Biggest POSITIVE difference
let positiveDiffChart = null; // Global variable to store the chart instance
function positiveDiff(user_data, selectedUser) {
    console.log("Debug: positiveDiff called with", user_data);
    if (positiveDiffChart) {
        positiveDiffChart.destroy();
        console.log("Debug: Existing positiveDiffChart destroyed.");
    }
    const container = document.getElementById('diffAvg_Positive_id');
    if (!container) {
        console.error('Debug: Element with id "diffAvg_Positive_id" not found.');
        return;
    }
    container.innerHTML = '';
    user_data.forEach(item => {
        console.log("Debug: Processing positive diff item", item);
        const movieDiv = document.createElement('div');
        movieDiv.style.display = 'inline-block';
        movieDiv.style.margin = '20px';
        movieDiv.style.textAlign = 'center';
        const img = document.createElement('img');
        img.src = item.poster_url;
        img.style.width = '100px';
        img.style.height = '150px';
        img.style.display = 'block';
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            if (item.film_url) {
                window.open(item.film_url, '_blank');
            } else {
                console.warn("Debug: film_url is missing for", item);
            }
        });
        const rating = document.createElement('div');
        rating.textContent = item.rating;
        rating.style.marginTop = '5px';
        rating.style.color = '#131313';
        const avg = document.createElement('div');
        avg.textContent = item.avg;
        avg.style.marginTop = '2px';
        avg.style.color = '#707070';
        avg.style.fontSize = '12px';
        movieDiv.appendChild(img);
        movieDiv.appendChild(rating);
        movieDiv.appendChild(avg);
        container.appendChild(movieDiv);
    });
    console.log("Debug: positiveDiff completed.");
}


// PLOT: Biggest NEGATIVE difference
let negativeDiffChart = null; // Global variable to store the chart instance
function negativeDiff(user_data, selectedUser) {
    // Destroy existing chart instance if it exists
    if (negativeDiffChart) {
        negativeDiffChart.destroy();
    }

    const container = document.getElementById('diffAvg_Negative_id'); // Get the container element

    if (!container) {
        console.error('Element with id "diffAvg_Negative_id" not found.');
        return; // Stop execution if container doesn't exist
    }

    // Clear previous content
    container.innerHTML = '';

    // Create a new div for each movie
    user_data.forEach(item => {
        const movieDiv = document.createElement('div');
        movieDiv.style.display = 'inline-block';
        movieDiv.style.margin = '20px';
        movieDiv.style.textAlign = 'center';

        const img = document.createElement('img');
        img.src = item.poster_url;
        img.style.width = '100px';
        img.style.height = '150px';
        img.style.display = 'block';

        // Change cursor to a hand when hovering over the image
        img.style.cursor = 'pointer';

        // Add click event listener to open URL in a new tab
        img.addEventListener('click', () => {
            if (item.film_url) {
                window.open(item.film_url, '_blank');
            } else {
                console.warn('film_url is missing for item:', item);
            }
        });

        const rating = document.createElement('div');
        rating.textContent = item.rating;
        rating.style.marginTop = '5px';
        rating.style.color = '#131313'; // Change rating color to a darker grey

        const avg = document.createElement('div');
        avg.textContent = item.avg;
        avg.style.marginTop = '2px';
        avg.style.color = '#707070'; // Change avg color to a lighter grey
        avg.style.fontSize = '12px'; // Set font size

        movieDiv.appendChild(img);
        movieDiv.appendChild(rating);
        movieDiv.appendChild(avg);
        container.appendChild(movieDiv);
    });
}


// PLOT: High and Low movies
let high_low_moviesChart = null; // Global variable to store the chart instance
function high_low_movies(user_data, selectedUser) {
    // Destroy existing chart instance if it exists
    if (high_low_moviesChart) {
        high_low_moviesChart.destroy();
    }

    const container = document.getElementById('highAndLows_id'); // Get the container element

    if (!container) {
        console.error('Element with id "highAndLows_id" not found.');
        return; // Stop execution if container doesn't exist
    }

    // Clear previous content
    container.innerHTML = '';

    // Create a new div for each movie
    user_data.forEach(item => {
        const movieDiv = document.createElement('div');
        movieDiv.style.display = 'inline-block';
        movieDiv.style.margin = '20px';
        movieDiv.style.textAlign = 'center';

        const hiLowLabel = document.createElement('div');
        hiLowLabel.textContent = item.hi_low_labels;
        hiLowLabel.style.marginBottom = '5px';
        hiLowLabel.style.color = '#131313'; // Change hi_low_labels color to a darker grey
        hiLowLabel.style.fontSize = '10px'; // Reduce font size
        hiLowLabel.style.fontWeight = 'bold'; // Make text bold

        const img = document.createElement('img');
        img.src = item.poster_url;
        img.style.width = '100px';
        img.style.height = '150px';
        img.style.display = 'block';

        // Change cursor to a hand when hovering over the image
        img.style.cursor = 'pointer';

        // Add click event listener to open URL in a new tab
        img.addEventListener('click', () => {
            if (item.film_url) {
                window.open(item.film_url, '_blank');
            } else {
                console.warn('film_url is missing for item:', item);
            }
        });

        const valueLabels = document.createElement('div');
        valueLabels.textContent = item.value_labels;
        valueLabels.style.marginTop = '5px';
        valueLabels.style.color = '#131313'; // Change value_labels color to a darker grey

        movieDiv.appendChild(hiLowLabel);
        movieDiv.appendChild(img);
        movieDiv.appendChild(valueLabels);
        container.appendChild(movieDiv);
    });
}


// PLOT: Pronto Pinarello Movies
let prontoMoviesChart = null; // Global variable to store the chart instance
function prontoMovies(user_data, selectedUser) {
    // Extract labels and data for the chart
    const labels = user_data.map(item => item.condition);
    const data = user_data.map(item => item.percentage);

    // Find the percentage value for "Vistos"
    const vistosEntry = user_data.find(item => item.condition === "Vistos");
    const vistosPercentage = vistosEntry ? `${vistosEntry.percentage}%` : 'N/A';

    // Destroy existing chart instance if it exists
    if (prontoMoviesChart) {
        prontoMoviesChart.destroy();
    }

    // Create a new chart instance
    prontoMoviesChart = new Chart(
        document.getElementById("prontoMovies_id"),
        {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: ['#A64253', '#131313'], // Colors for 'Viejas' and 'Estrenos'
                    hoverBackgroundColor: ['#DC7283', '#515151'], // Hover colors for 'Viejas' and 'Estrenos'
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                tooltips: {
                    enabled: false
                },
                legend: {
                    display: false
                }
            },
            plugins: [{
                id: 'centerText',
                beforeDraw: (chart) => {
                    const { width } = chart;
                    const { ctx } = chart;
                    ctx.save();
                    ctx.fillStyle = '#333';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';

                    // Dynamically adjust font size with min and max limits
                    let fontSize = Math.max(16, Math.min(width / 10, 20)); // Min 16px, Max 20px
                    ctx.font = `bold ${fontSize}px Arial`; // Set the font size

                    const centerX = width / 2;
                    const centerY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2;

                    ctx.fillText(vistosPercentage, centerX, centerY);
                    ctx.restore();
                }
            }]
        }
    );
}


// PLOT: Mapped coutnries
function movieMap(user_data, selectedUser) {
    // Summarize watch_count by country
    const countryWatchCount = {};
    user_data.forEach(item => {
        countryWatchCount[item.country] = (countryWatchCount[item.country] || 0) + item.watch_count;
    });

    // Define min and max colors
    const minColor = '#D4E0D8'; // Light green
    const maxColor = '#036666'; // Dark green

    // Create a color scale based on watch_count with more steps
    const maxCount = Math.max(...Object.values(countryWatchCount), 1);
    const colorScale = d3.scaleLinear()
        .domain([0, maxCount]) // Define domain from 0 to maxCount
        .range([minColor, maxColor]) // Use custom colors
        .interpolate(d3.interpolateHcl); // Smooth color transition in perceptually uniform color space

    // Create or select the SVG container with added margin for space
    const svg = d3.select('#mapContainer')
        .attr('width', '100%')
        .attr('height', '100%')
        .style('background-color', 'white')
        .style('margin', '10px'); // Added margin for space around the plot

    // Clear existing elements
    svg.selectAll('*').remove();

    // Create a tooltip for hover interactions with smaller font size
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('padding', '8px')
        .style('background', 'rgba(0, 0, 0, 0.7)')
        .style('color', 'white')
        .style('border-radius', '4px')
        .style('visibility', 'hidden')
        .style('font-size', '10px'); // Smaller font size for tooltip

    // Check if the device is desktop
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

    // Load and plot GeoJSON data
    d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
        .then(geojson => {
            const projection = d3.geoMercator().scale(130).translate([window.innerWidth / 2, window.innerHeight / 2]);
            const path = d3.geoPath().projection(projection);

            // Set up zoom behavior
            const zoom = d3.zoom()
                .scaleExtent([1, 8]) // Limit zoom scale (min, max)
                .on('zoom', function (event) {
                    svg.selectAll('path').attr('transform', event.transform); // Apply transform on zoom
                });

            svg.call(zoom); // Attach zoom behavior to the SVG container

            svg.selectAll('path')
                .data(geojson.features)
                .enter()
                .append('path')
                .attr('d', path)
                .attr('fill', d => {
                    const country = d.properties.name;
                    const count = countryWatchCount[country] || 0;

                    // Set color to #474747 if count is 0, otherwise use the colorScale
                    return count === 0 ? '#474747' : colorScale(count);
                })
                .attr('stroke', '#131313')
                .attr('stroke-width', 0.5)
                .on('mouseover', function (event, d) {
                    const country = d.properties.name;
                    const count = countryWatchCount[country] || 0;

                    d3.select(this).style('opacity', 0.7);

                    tooltip
                        .style('visibility', 'visible')
                        .html(`${country}<br>Pelis: ${count}`);
                })
                .on('mousemove', function (event) {
                    tooltip
                        .style('top', `${event.pageY + 10}px`)
                        .style('left', `${event.pageX + 10}px`);
                })
                .on('mouseout', function () {
                    d3.select(this).style('opacity', 1);
                    tooltip.style('visibility', 'hidden');
                })
                .on('click', function (event, d) {
                    if (isDesktop) {
                        const country = d.properties.name;
                        console.log('Selected Country:', country); // Log country name for debugging

                        // Find country data from user_data
                        const countryData = user_data.find(item => item.country === country);
                        if (countryData) {
                            console.log('Country Data:', countryData); // Log the country data for debugging
                            const url = `https://letterboxd.com/${selectedUser}/films/diary/for/2024/country/${countryData.country_url}/by/rating/`;
                            window.open(url, '_blank');
                        } else {
                            console.error('No country data found for:', country);
                        }
                    }
                });
        })
        .catch(err => console.error('Error loading GeoJSON data:', err));
}


















// Event Listeners for the plot buttons (ONLY DUALS)
const buttonPairs = [
    ['topReleases', 'topMovies'],
    ['weeklyWatched', 'weeklyRated'],
    ['genresWatched', 'genresRated'],
    ['countriesWatched', 'countriesRated'],
    ['languagesWatched', 'languagesRated'],
    ['actorsWatched', 'actorsRated'],
    ['directorsWatched', 'directorsRated'],
    ['diffAvg_Positive', 'diffAvg_Negative']
];

buttonPairs.forEach(([btn1, btn2]) => {
    document.getElementById(`${btn1}_button`).addEventListener('click', function() {
        document.getElementById(`${btn1}_id`).style.display = 'block';
        document.getElementById(`${btn2}_id`).style.display = 'none';
        this.classList.add('selected');
        document.getElementById(`${btn2}_button`).classList.remove('selected');
    });

    document.getElementById(`${btn2}_button`).addEventListener('click', function() {
        document.getElementById(`${btn1}_id`).style.display = 'none';
        document.getElementById(`${btn2}_id`).style.display = 'block';
        this.classList.add('selected');
        document.getElementById(`${btn1}_button`).classList.remove('selected');
    });
});




// Wait for the ODM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('dataForm');
    form.addEventListener('submit', event => {
        event.preventDefault(); // Prevent the default form submission

        const userInput = document.getElementById('userInput').value;
        const yearWanted = document.getElementById('yearWanted').value;

        const data = {
            userInput: userInput,
            yearWanted: yearWanted
        };

        fetch('/update_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // Call our main function to update all charts with the new data
            drawCharts(data, userInput);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
});