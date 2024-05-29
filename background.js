//onInstalled: 확장 프로그램이 설치되었을 때 수행할 태스크 설정
chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "OFF",
    });
});

const developer = "https://developer.chrome.com/docs/extensions/";

//확장 프로그램 아이콘을 클릭하면 이벤트 발생
//클릭하면 현재 탭의 URL이 위의 URL과 일치하는지 확인 후 뱃지 상태를 전환
//manifest.json에 action 권한이 없으면 작동하지 않음에 주의
chrome.action.onClicked.addListener(async (tab) => {
    if (tab.url.startsWith(developer)) {
        const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
        const nextState = prevState === "ON" ? "OFF" : "ON";

        console.log(`prevState: ${prevState}, nextState: ${nextState}`);
        await chrome.action.setBadgeText({
            tabId: tab.id,
            text: nextState,
        });

        if (nextState === "ON") {
            await chrome.scripting.insertCSS({
                files: ["focus-mode.css"],
                target: { tabId: tab.id },
            });
        } else if (nextState === "OFF") {
            await chrome.scripting.removeCSS({
                files: ["focus-mode.css"],
                target: { tabId: tab.id },
            });
        }
    }
});
