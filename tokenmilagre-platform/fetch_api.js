// Native fetch in Node 22

async function main() {
    try {
        const res = await fetch('http://localhost:3000/api/resources?verified=true');
        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Body:', text);
    } catch (e) {
        console.error(e);
    }
}

main();
