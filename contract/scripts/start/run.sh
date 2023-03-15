export NYXEUM_HOME=~/alchemy-university/nyxeum-game
npx hardhat run $NYXEUM_HOME/contract/scripts/start/01_deployNyxEssence.ts --network localhost
npx hardhat run $NYXEUM_HOME/contract/scripts/start/02_deployHeroesOfNyxeum.ts --network localhost
npx hardhat run $NYXEUM_HOME/contract/scripts/start/03_deployNyxeumGameV1.ts --network localhost
npx hardhat run $NYXEUM_HOME/contract/scripts/start/04_commitAndReveal.ts --network localhost
npx hardhat run $NYXEUM_HOME/contract/scripts/start/05_exploreNFTs.ts --network localhost
