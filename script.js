const _0x = {
	url: atob('aHR0cHM6Ly9hcGktaW5mZXJlbmNlLmh1Z2dpbmdmYWNlLmNvL21vZGVscy9zdGFiaWxpdHlhaS9zdGFibGUtZGlmZnVzaW9uLTMtbWVkaXVtLWRpZmZ1c2Vycw=='),
	key: atob('aGZfS01Sa1FvRnhmcllKTmtiZmd1eXBQUGtHbW51cEJDbHZuYQ=='),
	get: function() {
		return {url: this.url, key: this.key};
	}
};

function addWatermark() {
	const watermark = document.getElementById('watermark');
	const text = 'Developed by Bob';
	
	// Create watermark content with random characters
	const encodedText = btoa(text);
	const decodedText = atob(encodedText);
	
	// Add watermark with obfuscated text
	watermark.innerHTML = `<span data-content="${encodedText}">${decodedText}</span>`;
	
	// Prevent removal through console
	setInterval(() => {
		if (!document.getElementById('watermark')) {
			location.reload();
		}
		
		const currentWatermark = document.getElementById('watermark');
		if (currentWatermark.innerHTML === '' || 
			!currentWatermark.innerHTML.includes(encodedText) ||
			currentWatermark.style.display === 'none' ||
			currentWatermark.style.visibility === 'hidden' ||
			currentWatermark.style.opacity === '0') {
			location.reload();
		}
	}, 1000);
	
	// Prevent right-click
	document.addEventListener('contextmenu', (e) => e.preventDefault());
	
	// Prevent DevTools
	document.addEventListener('keydown', function(e) {
		if ((e.ctrlKey && e.shiftKey && e.key === 'I') ||
			(e.ctrlKey && e.shiftKey && e.key === 'J') ||
			(e.ctrlKey && e.key === 'U')) {
			e.preventDefault();
		}
	});
}

// Add this to your existing window.onload or at the end of your script
document.addEventListener('DOMContentLoaded', addWatermark);

const promptInput = document.getElementById('promptInput');
const generateBtn = document.getElementById('generateBtn');
const loadingContainer = document.getElementById('loadingContainer');
const progressFill = document.getElementById('progressFill');
const loadingText = document.getElementById('loadingText');
const resultImage = document.getElementById('resultImage');
const downloadBtn = document.getElementById('downloadBtn');

const loadingMessages = [
	"Gathering creative inspiration...",
	"Mixing digital colors...",
	"Adding magical details...",
	"Almost there...",
	"Finalizing your masterpiece..."
];

async function query(data) {
	const config = _0x.get();
	try {
		const response = await fetch(config.url, {
			headers: {
				Authorization: `Bearer ${config.key}`,
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(data),
		});
		if (!response.ok) throw new Error('Request failed');
		return await response.blob();
	} catch(e) {
		throw new Error('Processing failed');
	}
}

function updateLoadingProgress(progress) {
	progressFill.style.width = `${progress}%`;
	const messageIndex = Math.floor((progress / 100) * loadingMessages.length);
	loadingText.textContent = loadingMessages[Math.min(messageIndex, loadingMessages.length - 1)];
}

function simulateProgress() {
	let progress = 0;
	const interval = setInterval(() => {
		progress += 2;
		if (progress <= 90) {
			updateLoadingProgress(progress);
		} else {
			clearInterval(interval);
		}
	}, 100);
	return interval;
}

function downloadImage(imageUrl, promptText) {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `AI-Generated-${promptText.slice(0, 30)}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

generateBtn.addEventListener('click', async () => {
	const prompt = promptInput.value.trim();
	
	if (!prompt) {
		alert('Please enter a description');
		return;
	}

	loadingContainer.classList.remove('hidden');
	resultImage.classList.add('hidden');
	generateBtn.disabled = true;
	progressFill.style.width = '0%';
	downloadBtn.classList.add('hidden');

	const progressInterval = simulateProgress();

	try {
		const imageBlob = await query({ inputs: prompt });
		const imageUrl = URL.createObjectURL(imageBlob);
		
		clearInterval(progressInterval);
		updateLoadingProgress(100);
		
		resultImage.onload = () => {
			loadingContainer.classList.add('hidden');
			resultImage.classList.remove('hidden');
			downloadBtn.classList.remove('hidden');
		};
		resultImage.src = imageUrl;
		
		if (downloadBtn) {
			downloadBtn.onclick = () => downloadImage(imageUrl, prompt);
		}
	} catch (error) {
		alert('Error generating image: ' + error.message);
		if (loadingContainer) loadingContainer.classList.add('hidden');
		if (downloadBtn) downloadBtn.classList.add('hidden');
	} finally {
		if (generateBtn) generateBtn.disabled = false;
	}
});