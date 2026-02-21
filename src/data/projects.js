import project1Img from '@/assets/project-1.png'
import project2Img from '@/assets/project-2.png'
import project3Img from '@/assets/project-3.png'
import project4Img from '@/assets/project-4.png'
import mcdSweetcard1 from '@/assets/projects/mcd-sweetcard-1.png'
import mcdSweetcard2 from '@/assets/projects/mcd-sweetcard-2.png'
import mcdSweetcard3 from '@/assets/projects/mcd-sweetcard-3.png'
import mcdSweetcard4 from '@/assets/projects/mcd-sweetcard-4.png'
import gamecenter1 from '@/assets/projects/Gamecenter-1.png'
import gamecenter2 from '@/assets/projects/Gamecenter-2.png'
import gamecenter3 from '@/assets/projects/Gamecenter-3.png'
import famiport1 from '@/assets/projects/Famiport-1.png'
import famiport2 from '@/assets/projects/Famiport-2.png'
import famiport3 from '@/assets/projects/Famiport-3.png'
import famiport4 from '@/assets/projects/Famiport-4.png'

export const projects = [
  {
    id: 'mcd-sweetcard',
    tag: 'App UI/UX Design',
    title: '麥當勞 _ 甜心卡',
    subtitle: '數位化會員卡體驗，優化完整的新手引導兼顧易用性。',
    coverImage: project1Img,
    meta: { client: "McDonald's Taiwan", year: '2023', role: 'UI/UX Designer', team: 'EY Design Team' },
    images: [
      mcdSweetcard1,
      mcdSweetcard2,
      mcdSweetcard3,
      mcdSweetcard4,
    ],
    detail: {
      projectTypes: ['App UI 設計', '使用者體驗優化'],
      industryTypes: ['餐飲服務', '會員經濟'],
      taskTags: ['UI 設計', 'UX 研究', '新手引導流程'],
      links: [{ label: 'App Store', url: '#' }],
      goal: '麥當勞甜心卡從實體卡片轉型為數位化會員卡，目標是降低新用戶進入門檻，同時提升整體使用體驗。核心挑戰在於如何在保留原有甜心卡優惠機制的基礎上，設計出直覺且易於操作的數位化流程，讓不同年齡層的使用者都能快速上手。',
      designSections: [
        {
          title: '新手引導',
          content: '透過分步驟引導與即時回饋機制，將原本複雜的開卡與綁定流程拆解為 3 個簡單步驟。每個步驟搭配動態視覺提示，確保使用者在過程中不會迷失，有效降低首次使用的跳出率。',
        },
        {
          title: '優惠兌換體驗',
          content: '重新設計優惠券展示與兌換介面，以卡片式佈局呈現可用優惠，搭配倒數計時與使用狀態標記，讓使用者能一目了然地管理手中的甜心卡優惠，提升兌換率與回訪意願。',
        },
      ],
    },
  },
  {
    id: 'mcd-points',
    tag: 'App UI/UX Design',
    title: '麥當勞 _ 點數中心',
    subtitle: '優化會員點數累積與兌換流程，增強使用者黏著度。',
    coverImage: project2Img,
    meta: { client: "McDonald's Taiwan", year: '2023', role: 'UI/UX Designer', team: 'EY Design Team' },
    images: [
      project2Img,
      project2Img,
    ],
    detail: {
      projectTypes: ['App UI 設計', '互動設計'],
      industryTypes: ['餐飲服務', '會員經濟'],
      taskTags: ['UI 設計', 'UX 研究', '數據視覺化'],
      links: [{ label: 'App Store', url: '#' }],
      goal: '麥當勞點數中心旨在打造一個清晰、有趣且具黏著度的點數管理體驗。使用者經常不清楚自己的點數餘額與可兌換商品，導致點數過期浪費。本專案目標是讓點數的累積與兌換過程變得透明且令人期待。',
      designSections: [
        {
          title: '點數儀表板',
          content: '以視覺化儀表板呈現點數餘額、累積進度與即將到期的點數，搭配環形進度條與里程碑動畫，讓使用者對自己的點數狀態一目了然，並產生持續消費累積的動力。',
        },
        {
          title: '兌換流程簡化',
          content: '將原本需要多步驟的兌換流程縮減為兩步完成，透過智慧推薦演算法，根據使用者的消費習慣優先顯示最相關的兌換商品，有效提升兌換完成率。',
        },
      ],
    },
  },
  {
    id: 'familymart-gamecenter',
    tag: 'App UI/UX Design',
    title: '全家 _ 遊戲中心',
    subtitle: '整合多款遊戲任務模組，打造一站式配點紅利好去處。',
    coverImage: project3Img,
    meta: { client: '全家便利商店', year: '2023', role: 'UI/UX Designer', team: 'EY Design Team' },
    images: [
      gamecenter1,
      gamecenter2,
      gamecenter3,
    ],
    detail: {
      projectTypes: ['App UI 設計', '遊戲化設計'],
      industryTypes: ['零售通路', '會員經濟'],
      taskTags: ['UI 設計', 'UX 研究', '遊戲化機制'],
      links: [{ label: '全家 App', url: '#' }],
      goal: '全家遊戲中心希望透過遊戲化機制提升會員活躍度與 App 開啟頻率。核心挑戰是如何在不同類型的小遊戲之間建立統一的任務系統與獎勵機制，讓使用者在娛樂的同時自然地累積紅利點數。',
      designSections: [
        {
          title: '任務系統整合',
          content: '設計統一的任務中心介面，將每日簽到、遊戲挑戰、消費任務等不同類型的任務整合在同一個入口，透過進度條與徽章系統，讓使用者清楚掌握完成進度與可獲得的獎勵。',
        },
        {
          title: '遊戲模組化架構',
          content: '建立可擴展的遊戲模組框架，每款遊戲擁有獨立的視覺主題但共享統一的積分與獎勵系統。透過卡片式入口設計，使用者可快速瀏覽並選擇想玩的遊戲，降低選擇障礙。',
        },
      ],
    },
  },
  {
    id: 'familymart-famiport',
    tag: 'App UI/UX Design',
    title: '全家 _ MyFamiPort',
    subtitle: '重新設計服務流程，讓使用者能夠快速完成代收。',
    coverImage: project4Img,
    meta: { client: '全家便利商店', year: '2024', role: 'UI/UX Designer', team: 'EY Design Team' },
    images: [
      famiport1,
      famiport2,
      famiport3,
      famiport4,
    ],
    detail: {
      projectTypes: ['App UI 設計', '服務流程優化'],
      industryTypes: ['零售通路', '生活服務'],
      taskTags: ['UI 設計', 'UX 研究', '流程簡化'],
      links: [{ label: '全家 App', url: '#' }],
      goal: 'MyFamiPort 將原本僅能在店內機台操作的代收服務數位化至手機端，目標是讓使用者不需到店即可完成繳費、購票、預購等操作。核心挑戰在於如何將多元且複雜的服務類型，以簡潔的資訊架構呈現，讓使用者快速找到所需服務。',
      designSections: [
        {
          title: '服務分類架構',
          content: '以使用情境為核心重新分類服務項目，取代原本以業務類型分類的方式。透過常用服務置頂、搜尋建議與最近使用紀錄，大幅縮短使用者找到目標服務的時間。',
        },
        {
          title: '代收繳費流程',
          content: '將繳費流程從原本的 5 個步驟精簡為 3 步完成，支援掃描條碼自動帶入資料，並在付款前提供清晰的費用明細確認頁，降低操作錯誤率並提升使用者信心。',
        },
      ],
    },
  },
]
