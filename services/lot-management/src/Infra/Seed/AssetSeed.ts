import { NullableObject } from '@ddd/core';
import { Query } from '@ddd/specifications';
import { faker } from '@faker-js/faker';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { AssetNotFoundError } from '@schema/common';
import { LotManagementSchema } from '@schema/lot-management';
import { SeedUtils } from '@shared/db';

import { ASSET_REPOSITORY_INJECT_TOKEN, AssetCreate } from '../../Application';
import { Asset, AssetPK } from '../../Domain';

export class AssetSeed {
  @Inject(SeedUtils)
  private seedUtils: SeedUtils;

  @Inject(AssetCreate)
  private assetCreate: AssetCreate;

  @InjectContext(ASSET_REPOSITORY_INJECT_TOKEN)
  private assetRepository: InjectContext<ASSET_REPOSITORY_INJECT_TOKEN>;

  async createDemo() {
    const imagePrefix = (name: string) => `assets_seed_images_${name}`;

    await this.createMany([
      {
        id: 'layer_zero',
        title: 'Layer Zero',
        description:
          'LayerZero is an omnichain interoperability protocol designed for lightweight message passing across chains. LayerZero provides authentic and guaranteed message delivery with configurable trustlessness.',
        logoFile: imagePrefix('layer_zero.png'),
        verticals: ['BRIDGE', 'INFRA', 'ZK_ROLLUP'],
        tier: 'TIER_1',
        links: [
          {
            type: 'SITE',
            url: 'https://layerzero.network',
          },
          {
            type: 'TWITTER',
            url: 'https://twitter.com/LayerZero_Labs',
          },
          {
            type: 'DISCORD',
            url: 'https://discord-layerzero.netlify.app/discord',
          },
          {
            type: 'OTHER',
            url: 'https://medium.com/layerzero-official',
            title: 'Medium',
          },
        ],
      },
      {
        id: 'ledger',
        title: 'Ledger',
        description: 'Ledger is a technology company that designs and manufactures hardware wallets for the storage of digital assets.',
        logoFile: imagePrefix('ledger.png'),
        verticals: ['BLOCKCHAIN_SERVICE'],
        tier: 'TIER_1',
        links: [
          {
            type: 'SITE',
            url: 'https://www.ledger.com',
          },
          {
            type: 'TWITTER',
            url: 'https://twitter.com/Ledger',
          },
          {
            type: 'OTHER',
            title: 'Linkedin',
            url: 'https://www.linkedin.com/company/ledgerhq',
          },
        ],
      },
      {
        id: 'aleo',
        title: 'Aleo',
        description: 'Aleo is the ultimate toolkit for building zero-knowledge applications.',
        logoFile: imagePrefix('aleo.png'),
        verticals: ['ZK_ROLLUP'],
        tier: 'TIER_2',
        links: [{ type: 'SITE', url: 'https://www.aleo.org' }],
      },
      {
        id: 'eigenlayer',
        title: 'EigenLayer',
        description:
          'EigenLayer a platform to leverage Ethereum security through the innovative method of restaking. EigenLayer is a set of smart contracts on Ethereum that allows consensus layer Ether (ETH) stakers to opt in to validating new software modules built on top of the Ethereum ecosystem.',
        logoFile: imagePrefix('eigenlayer.png'),
        verticals: ['INFRA', 'BLOCKCHAIN_SERVICE', 'DEFI'],
        tier: 'TIER_2',
        links: [
          {
            type: 'SITE',
            url: 'https://www.eigenlayer.xyz',
          },
          {
            type: 'TWITTER',
            url: 'https://twitter.com/eigenlayer',
          },
          {
            type: 'DISCORD',
            url: 'https://discord.gg/eigenlayer',
          },
          {
            type: 'OTHER',
            title: 'LinkedIn',
            url: 'https://www.linkedin.com/company/layrlabs/',
          },
        ],
      },
      {
        id: 'zksync',
        title: 'zkSync',
        description:
          'zkSync is a ZK rollup, a trustless protocol that uses cryptographic validity proofs to provide scalable and low-cost transactions on Ethereum. In zkSync, computation is performed off-chain and most data is stored off-chain as well.',
        logoFile: imagePrefix('zksync.png'),
        verticals: ['ZK_ROLLUP'],
        tier: 'TIER_1',
        links: [
          {
            type: 'SITE',
            url: 'https://zksync.io',
          },
          {
            type: 'TWITTER',
            url: 'https://twitter.com/zksync',
          },
          {
            type: 'DISCORD',
            url: 'https://discord.com/invite/px2aR7w',
          },
          {
            type: 'GITHUB',
            url: 'https://github.com/matter-labs/zksync',
          },
        ],
      },
      {
        id: 'ripple',
        title: 'Ripple',
        description: 'Providing one frictionless experience to send money globally using the power of blockchain',
        logoFile: imagePrefix('ripple.png'),
        verticals: ['LAYER_1'],
        tier: 'TIER_1',
        links: [
          { type: 'SITE', url: 'https://ripple.com/' },
          { type: 'WHITE_PAPER', url: 'https://ripple.com/files/ripple_consensus_whitepaper.pdf' },
          { type: 'TWITTER', url: 'https://twitter.com/ripple' },
          { type: 'GITHUB', url: 'https://github.com/ripple/rippled' },
        ],
      },
      {
        id: 'scroll',
        title: 'Scroll',
        description: 'Scroll is a zkEVM-based zkRollup on Ethereum that enables native compatibility for existing Ethereum applications and tools.',
        logoFile: imagePrefix('scroll.png'),
        verticals: ['ZK_ROLLUP'],
        tier: 'TIER_1',
        links: [
          {
            type: 'SITE',
            url: 'https://scroll.io',
          },
          {
            type: 'TWITTER',
            url: 'https://twitter.com/Scroll_ZKP',
          },
          {
            type: 'DISCORD',
            url: 'https://discord.gg/s84eJSdFhn',
          },
          {
            type: 'GITHUB',
            url: 'https://github.com/scroll-tech',
          },
          {
            type: 'OTHER',
            title: 'LinkedIn',
            url: 'https://www.linkedin.com/company/scroll-io',
          },
        ],
      },
      {
        id: 'altlayer',
        title: 'Altlayer',
        description:
          'AltLayer offers a unique rollup-as-a-service solution to help dApps scale. With AltLayer, a developer expecting a burst in demand can: 1) spin up a scalable rollup, 2) use it for as long as needed, and then 3) dispose of it by doing an “end-of-life” settlement on L1.',
        logoFile: imagePrefix('altlayer.png'),
        verticals: ['BRIDGE', 'BLOCKCHAIN_SERVICE', 'LAYER_1'],
        tier: 'TIER_3',
        links: [
          {
            type: 'SITE',
            url: 'https://altlayer.io',
          },
          {
            type: 'TWITTER',
            url: 'https://twitter.com/alt_layer',
          },
          {
            type: 'GITHUB',
            url: 'https://github.com/alt-research',
          },
          {
            type: 'DISCORD',
            url: 'https://discord.com/invite/altlayer',
          },
        ],
      },
      {
        id: 'starkware',
        title: 'StarkWare',
        description:
          'They develop STARK-based solutions [STARK aka zk-SNARKs or zk-STARKs - stands for Scalable Transparent Argument of Knowledge]. Main products are StarkEx, a standalone permissioned Validity-Rollup, and StarkNet, a permissionless decentralized ZK-Rollup.',
        logoFile: imagePrefix('starkware.png'),
        verticals: ['ZK_ROLLUP', 'LAYER_1'],
        tier: 'TIER_1',
        links: [
          { type: 'SITE', url: 'https://starkware.com' },
          { type: 'WHITE_PAPER', url: 'https://docs.starkware.co/starkex/index.html' },
          { type: 'TWITTER', url: 'https://twitter.com/StarkWareLtd/' },
          { type: 'GITHUB', url: 'https://github.com/starkware-libs/' },
          { type: 'OTHER', title: 'Medium', url: 'https://medium.com/starkware' },
        ],
      },
      {
        id: 'zeta_chain',
        title: 'Zeta Chain',
        description:
          'ZetaChain is the only decentralized blockchain and smart contract platform built for omnichain interoperability. The project currently has more than 27k decentralized app contracts deployed on its network, spanning Defi, NFT, social, identity and gaming protocols.',
        logoFile: imagePrefix('zeta_chain.png'),
        verticals: ['BLOCKCHAIN_SERVICE', 'LAYER_1'],
        tier: 'TIER_3',
        links: [
          { type: 'SITE', url: 'https://www.zetachain.com' },
          { type: 'WHITE_PAPER', url: 'https://www.zetachain.com/whitepaper.pdf' },
          { type: 'TWITTER', url: 'https://twitter.com/zetablockchain' },
          { type: 'DISCORD', url: 'https://discord.com/invite/NKAUn7d5vX' },
          { type: 'GITHUB', url: 'https://github.com/zeta-chain' },
          { type: 'OTHER', title: 'Telegram', url: 'https://t.me/zetachainofficial' },
        ],
      },
      {
        id: 'flashbots',
        title: 'Flashbots',
        description:
          'Flashbots service proposes blocks for validators running the Ethereum blockchain. MEV, or maximal extractable value, is a technique that involves manipulating transaction sequencing to capitalize on profitable on-chain trades.',
        logoFile: imagePrefix('flashbots.png'),
        verticals: ['BLOCKCHAIN_SERVICE', 'DEFI'],
        tier: 'TIER_2',
        links: [
          { type: 'SITE', url: 'https://www.flashbots.net/' },
          { type: 'WHITE_PAPER', url: 'https://docs.flashbots.net/' },
          { type: 'DISCORD', url: 'https://discord.com/invite/flashbots' },
          { type: 'GITHUB', url: 'https://github.com/flashbots' },
          { type: 'OTHER', title: 'Medium', url: 'https://medium.com/flashbots' },
        ],
      },
      {
        id: 'aztec',
        title: 'Aztec',
        description:
          'Aztec Network is a private ZK-rollup on Ethereum, enabling decentralized applications to access privacy and scale. Aztec’s rollup is secured by its industry-standard PLONK proving mechanism used by the leading zero-knowledge scaling projects.',
        logoFile: imagePrefix('aztec.png'),
        verticals: ['ZK_ROLLUP', 'LAYER_1'],
        tier: 'TIER_2',
        links: [
          { type: 'SITE', url: 'https://aztec.network/index.html' },
          { type: 'WHITE_PAPER', url: 'https://docs.aztec.network' },
          { type: 'TWITTER', url: 'https://twitter.com/aztecnetwork' },
          { type: 'DISCORD', url: 'https://discord.gg/aztec' },
          { type: 'GITHUB', url: 'https://github.com/AztecProtocol' },
        ],
      },
      {
        id: 'sismo',
        title: 'Sismo',
        description:
          'Sismo leverages zero-knowledge proofs (ZKPs) to enable users to aggregate and selectively disclose personal data to applications.By using Sismo Connect, an easy-to-integrate SSO, applications can now safely obtain user data that was previously inaccessible.',
        logoFile: imagePrefix('sismo.png'),
        verticals: ['BLOCKCHAIN_SERVICE'],
        tier: 'TIER_1',
        links: [
          { type: 'SITE', url: 'https://www.sismo.io' },
          { type: 'WHITE_PAPER', url: 'https://docs.sismo.io/sismo-docs/welcome-to-sismo/readme' },
          { type: 'TWITTER', url: 'https://twitter.com/sismo_eth' },
          { type: 'DISCORD', url: 'https://discord.com/invite/sismo' },
          { type: 'GITHUB', url: 'https://github.com/sismo-core' },
        ],
      },
      {
        id: 'hyperlane',
        title: 'Hyperlane',
        description:
          'Hyperlane (originally named Abacus) is a blockchain-focused platform that provides developers with a messaging application programming interface (API) and software development kit (SDK) to easily build apps that can be accessed from any blockchain.',
        logoFile: imagePrefix('hyperlane.png'),
        verticals: ['BLOCKCHAIN_SERVICE', 'BRIDGE'],
        tier: 'TIER_2',
        links: [
          { type: 'SITE', url: 'https://www.hyperlane.xyz' },
          { type: 'TWITTER', url: 'https://twitter.com/Hyperlane_xyz' },
          { type: 'WHITE_PAPER', url: 'https://docs.hyperlane.xyz/hyperlane-docs' },
          { type: 'GITHUB', url: 'https://github.com/hyperlane-xyz' },
          { type: 'DISCORD', url: 'https://discord.gg/VK9ZUy3aTV' },
        ],
      },
      {
        id: 'gensyn',
        title: 'Gensyn',
        description:
          'The Gensyn Protocol is a layer-1 trustless protocol for deep learning computation that directly and immediately rewards supply-side participants for pledging their compute time to the network and performing ML tasks.',
        logoFile: imagePrefix('gensyn.png'),
        verticals: ['BLOCKCHAIN_SERVICE', 'INFRA'],
        tier: 'TIER_3',
        links: [
          { type: 'SITE', url: 'https://www.gensyn.ai' },
          { type: 'TWITTER', url: 'https://twitter.com/gensynai' },
          { type: 'DISCORD', url: 'https://discord.com/invite/bCHyMQu4Qn' },
        ],
      },
      {
        id: 'manta_network',
        title: 'Manta Network',
        description: 'The Fastest ZK L1 Supporting Modular On-chain Privacy for Polkadot Ecosystem.',
        logoFile: imagePrefix('manta_network.png'),
        verticals: ['ZK_ROLLUP', 'LAYER_1'],
        tier: 'TIER_3',
        links: [
          { type: 'SITE', url: 'https://manta.network' },
          { type: 'WHITE_PAPER', url: 'https://github.com/Manta-Network/Manta-Whitepaper' },
          { type: 'GITHUB', url: 'https://github.com/Manta-Network' },
          { type: 'DISCORD', url: 'https://discord.com/invite/mantanetwork' },
          { type: 'OTHER', title: 'Cryptorank', url: 'https://cryptorank.io/news/manta-network' },
        ],
      },
      {
        id: 'lens',
        title: 'Lens',
        description:
          'The Lens Protocol is a Web3 social graph on the Polygon Proof-of-Stake blockchain. It is designed to empower creators to own the links between themselves and their community, forming a fully composable, user-owned social graph.',
        logoFile: imagePrefix('lens.png'),
        verticals: ['SOCIAL'],
        tier: 'TIER_4',
        links: [
          { type: 'SITE', url: 'https://www.lens.xyz' },
          { type: 'WHITE_PAPER', url: 'https://docs.lens.xyz' },
          { type: 'TWITTER', url: 'https://twitter.com/LensProtocol' },
          { type: 'DISCORD', url: 'https://discord.gg/lensprotocol' },
        ],
      },
      {
        id: 'xdao',
        title: 'XDAO',
        description:
          'DAO builder that was created for companies and institutions to provide the most secure and technologically advanced solution for managing corporate crypto assets. XDAO is a fully customizable tool that can be used for treasury management, as a multisig wallet and the platform for raising investment.',
        logoFile: imagePrefix('xdao.png'),
        verticals: ['DEFI', 'SOCIAL'],
        tier: 'TIER_2',
        links: [
          { type: 'SITE', url: 'https://www.xdao.app/' },
          { type: 'WHITE_PAPER', url: 'https://docs.xdao.app' },
          { type: 'TWITTER', url: 'https://twitter.com/xdaoapp' },
          { type: 'GITHUB', url: 'https://github.com/xdao-app/xdao-contracts' },
          { type: 'DISCORD', url: 'https://discord.com/invite/xdaoapp' },
          { type: 'OTHER', title: 'Telegram', url: 'https://t.me/xdaoapp' },
        ],
      },
      {
        id: 'volare_network',
        title: 'Volare Network',
        description:
          'The Volare Project is a project to construct a vast ecosystem based on blockchain networks deploying Equilibrium technology. While its ultimate goal is to use the high speed and scalability of Equilibrium to promote the commercial use of blockchain technology across several industries.',
        logoFile: imagePrefix('volare_network.png'),
        verticals: ['INFRA'],
        tier: 'TIER_4',
        links: [
          { type: 'SITE', url: 'https://volare.network/' },
          { type: 'WHITE_PAPER', url: 'https://s3.ap-northeast-2.amazonaws.com/cs-files.eqbr.com/VOLARE/Volare_Business_WhitePaper.pdf' },
          { type: 'TWITTER', url: 'https://twitter.com/volare_official' },
          { type: 'OTHER', title: 'Medium', url: 'https://medium.com/volare' },
        ],
      },
      {
        id: 'pool_data',
        title: 'Pool Data',
        description:
          'Pocket is a revolutionary new way of transforming the data economy for people and business.Privacy regulation, anti-tracking measures and the end of 3rd party cookies makes it increasingly difficult for e-commerce platforms and publishers that aren’t Big Tech, to know and serve their customers.',
        logoFile: imagePrefix('pool_data.png'),
        verticals: ['BLOCKCHAIN_SERVICE'],
        tier: 'TIER_3',
        links: [
          { type: 'SITE', url: 'https://www.pooldata.io/' },
          { type: 'WHITE_PAPER', url: 'https://pooldata.cdn.prismic.io/pooldata/b6b4fc13-3bbc-478f-9241-b06f4226f8d0_Pool_TechWhitepaper.pdf' },
          { type: 'TWITTER', url: 'https://twitter.com/pooldata' },
        ],
      },
      {
        id: 'skill_labs',
        title: 'Skill Labs',
        description: 'Skill Labs is a cross-chain ecosystem that helps investors, games, and players find each other to optimize their benefits in the metaverse.',
        logoFile: imagePrefix('skill_labs.png'),
        verticals: ['SOCIAL'],
        tier: 'TIER_4',
        links: [
          { type: 'SITE', url: 'https://skilllabs.io' },
          { type: 'TWITTER', url: 'https://twitter.com/Skill_Labs_gg' },
          { type: 'DISCORD', url: 'https://discord.com/invite/skilllabs' },
          { type: 'OTHER', title: 'Telegram', url: 'https://t.me/skilllabs' },
        ],
      },
      {
        id: 'tranching_protocol',
        title: 'Tranching Protocol',
        description: 'Tranching Protocol is an yield optimization and hedging protocol implementing tranching for yield farming.',
        logoFile: imagePrefix('tranching_protocol.png'),
        verticals: ['DEFI'],
        tier: 'TIER_3',
        links: [
          { type: 'SITE', url: 'https://tranching.com/' },
          { type: 'TWITTER', url: 'https://twitter.com/TranchingPro' },
        ],
      },
      {
        id: 'angelic',
        title: 'Angelic',
        description: 'Angelic is a narrative multiplayer Strategy RPG enhanced by the blockchain and set in a collaborative Sci-Fi universe. Funded by tier-1 VC : Animoca Brands and Pantera Capital.',
        logoFile: imagePrefix('angelic.png'),
        verticals: ['DEFI', 'NFT', 'METAVERSE'],
        tier: 'TIER_3',
        links: [
          { type: 'SITE', url: 'https://www.angelicthegame.com/' },
          { type: 'WHITE_PAPER', url: 'https://angelicthegame.com/wp-content/uploads/2022/01/Metaverse_Game_Studios_-_Angelic_Whitepaper_v0.1.27-4.pdf' },
          { type: 'TWITTER', url: 'https://twitter.com/AngelicTheGame' },
          { type: 'DISCORD', url: 'https://discord.com/invite/yDZhX36rtJ' },
          { type: 'OTHER', title: 'Telegram', url: 'https://t.me/AngelicTheGame' },
        ],
      },
      {
        id: 'unicoin',
        title: 'Unicoin',
        description:
          'Unicoin is a stable alternative for crypto investors, backed by a portfolio of equity stakes in companies associated with Unicorn Hunters. Ideal for those seeking crypto investment with reduced volatility compared to early coins.',
        logoFile: imagePrefix('unicoin.png'),
        verticals: ['SOCIAL'],
        tier: 'TIER_2',
        links: [
          { type: 'SITE', url: 'https://unicoin.com/' },
          { type: 'TWITTER', url: 'https://twitter.com/Unicoin_News' },
          { type: 'OTHER', title: 'Telegram', url: 'https://t.me/Unicoin_OfficialTG' },
        ],
      },
      {
        id: 'arcade',
        title: 'Arcade',
        description:
          'Arcade is the GameFi platform that gives its community the opportunity to earn meaningful rewards, from various Play-and-Earn metaverse games, without direct gameplay or ownership of in-game NFTs.',
        logoFile: imagePrefix('arcade.png'),
        verticals: ['GAMEFI', 'BLOCKCHAIN_SERVICE'],
        tier: 'TIER_3',
        links: [
          { type: 'SITE', url: 'https://beacons.ai/' },
          { type: 'WHITE_PAPER', url: 'https://angelicthegame.com/wp-content/uploads/2022/01/Metaverse_Game_Studios_-_Angelic_Whitepaper_v0.1.27-4.pdf' },
          { type: 'TWITTER', url: 'https://twitter.com/arcade2earn' },
          { type: 'REDDIT', url: 'https://www.reddit.com/r/arcade2earn/?rdt=61887' },
          { type: 'OTHER', title: 'Telegram', url: 'https://t.me/arcade2earn' },
        ],
      },
      {
        id: 'hashstack_protocol',
        title: 'Hashstack Protocol',
        description: 'Hashstack is a non-custodial zk-native money market protocol that has made a strategic shift to Starkware developed Starknet.',
        logoFile: imagePrefix('hashstack_protocol.png'),
        verticals: ['ZK_ROLLUP', 'DEFI'],
        tier: 'TIER_3',
        links: [
          { type: 'SITE', url: 'https://hashstack.finance' },
          { type: 'WHITE_PAPER', url: 'https://docs.hashstack.finance/whitepaper' },
          { type: 'TWITTER', url: 'https://twitter.com/0xhashstack' },
          { type: 'GITHUB', url: 'https://github.com/0xHashstack' },
          { type: 'DISCORD', url: 'http://hashstack.community' },
        ],
      },
    ]);
  }

  async createMany(props: LotManagementSchema.RPC.DTO.AssetCreate.Payload[]) {
    await Promise.all(props.map((props) => this.create(props)));
  }

  async create(props: LotManagementSchema.RPC.DTO.AssetCreate.Payload) {
    return this.seedUtils.newRequest('asset.create', async () => {
      await this.assetCreate.validate(props);
      return await this.assetCreate.execute(props);
    });
  }

  async getRandomAsset(): Promise<Asset> {
    const assetRepository = await this.assetRepository();

    const total = await assetRepository.count();
    const randomSkip = faker.number.int({ min: 0, max: total * 2 });
    const assets = await assetRepository.find(Query.create(Asset).addPageable(randomSkip, 1));

    const asset = NullableObject(assets.items[0]);
    if (NullableObject.isEmpty(asset)) throw new AssetNotFoundError('random');

    return asset;
  }

  async getAsset(id: string) {
    const assetRepository = await this.assetRepository();

    const assetPK = new AssetPK(id);
    const asset = await assetRepository.get(assetPK);
    if (NullableObject.isEmpty(asset)) throw new AssetNotFoundError(id);

    return asset;
  }
}
