const promptInput = document.getElementById('promptInput');
const generateBtn = document.getElementById('generateBtn');
const loadingContainer = document.getElementById('loadingContainer');
const progressFill = document.getElementById('progressFill');
const loadingText = document.getElementById('loadingText');
const resultImage = document.getElementById('resultImage');
const downloadContainer = document.getElementById('downloadContainer');
const downloadBtn = document.getElementById('downloadBtn');

const loadingMessages = [
	"Gathering creative inspiration...",
	"Mixing digital colors...",
	"Adding magical details...",
	"Almost there...",
	"Finalizing your masterpiece..."
];

async function query(data) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3-medium-diffusers",
		{
			headers: {
				Authorization: "Bearer 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",
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.blob();
	return result;
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

	const progressInterval = simulateProgress();

	try {
		const imageBlob = await query({ inputs: prompt });
		const imageUrl = URL.createObjectURL(imageBlob);
		
		clearInterval(progressInterval);
		updateLoadingProgress(100);
		
		setTimeout(() => {
			resultImage.onload = () => {
				loadingContainer.classList.add('hidden');
				resultImage.classList.remove('hidden');
				downloadBtn.classList.remove('hidden');
			};
			resultImage.src = imageUrl;
			
			downloadBtn.onclick = () => downloadImage(imageUrl, prompt);
		}, 500);
	} catch (error) {
		alert('Error generating image: ' + error.message);
		loadingContainer.classList.add('hidden');
		downloadBtn.classList.add('hidden');
	} finally {
		generateBtn.disabled = false;
	}
});

document.addEventListener('DOMContentLoaded', addWatermark);