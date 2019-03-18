#!/usr/bin/env bash

# wget -qO- https://raw.githubusercontent.com/zxdong262/ringcentral-chatbot-factory/master/bin/init.sh | bash
# curl -o- https://raw.githubusercontent.com/zxdong262/ringcentral-chatbot-factory/master/bin/init.sh | bash
{ # this ensures the entire script is downloaded #

echo -e "\033[34m=> requires nodejs8+ and npm 5.2+\033[0m"
NEW_UUID=$(LC_CTYPE=C tr -dc 0-9 < /dev/urandom | head -c 4 | xargs | cat)
echo '=> init bot project'
FOLDER="ringcentral-chatbot$NEW_UUID"
cmd="npx ringcentral-chatbot-factory $FOLDER -A"
echo "=> $cmd"
npx ringcentral-chatbot-factory $FOLDER -A

echo -e '\033[34m=> init project\033[0m'
cd $FOLDER

npm i
cp .sample.env .env
cp bot-sample.js src/bot.js

echo ""
echo ""
echo ""
echo ""
echo "=============="
echo ""
echo -e "=> All project files are ready, run \033[34m'cd $FOLDER'\033[0m first"
echo ""
echo "=============="

echo ""
echo ""
echo -e "\033[34m=> 3 more steps to run the bot.\033[0m"
echo ""
cat << EOF

1. Run ngrok proxy by "npm run proxy", and put the server link: https://xxxx.ngrok.com in .env set

RINGCENTRAL_BOT_SERVER prop=https://xxxx.ngrok.com

2. Visit https://developer.ringcentral.com/new-app?name=Sample+Bot+App&desc=A+sample+app+created+in+conjunction+with+the+python+bot+framework&public=true&type=ServerBot&carriers=7710,7310,3420&permissions=ReadAccounts,EditExtensions,SubscriptionWebhook,Glip&redirectUri= to create app bot app, set https://xxxx.ngrok.com/bot/oauth as redirectUri in app setting, get credentials: Client ID and Client Secret from app credential page, and put it in .env:

RINGCENTRAL_CHATBOT_CLIENT_ID=app Client ID
RINGCENTRAL_CHATBOT_CLIENT_SECRET=app Client Secret

3. run bot by "npm start" in another teminal

Then, goto app bot page, click the add bot button to add the bot, and togo https://glip-app.devtest.ringcentral.com/ to talk to the bot.

=> That's it, have fun!
EOF
echo ""
echo ""

} # this ensures the entire script is downloaded #