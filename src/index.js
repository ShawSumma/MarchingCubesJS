import './global.css';

import App from './App.svelte';
import { Sim } from './sim/sim';

const sim = new Sim();

const app = new App({
	target: document.body,
	props: {
		sim,
	}
});

export default app;