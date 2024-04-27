const publicVapidKey="BChAevcqmiOIf9QtxkqfKxE8IcbpnkzviCU7-gDUANrm4LN8xTJ3IfN9U3btaGNauIosXW5X2jKUK4s6u-SVag8"
async function registerServiceWorker() {
    const register = await navigator.serviceWorker.register('./worker.js', {
        scope: '/'
    });

    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicVapidKey,
    });

    await fetch("http://localhost:4000/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
            "Content-Type": "application/json",
        }
    })
}