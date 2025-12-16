document.addEventListener('DOMContentLoaded', () => {
    // Lucideアイコンの初期化
    lucide.createIcons();

    // --- データ定義 ---
    
    // 福利厚生データ
    const benefitsData = [
        { 
            name: '完全週休二日制', 
            icon: 'calendar', 
            colorClass: 'bg-pink-400', 
            desc: '日曜＋他1日休み。オンオフの切り替えバッチリ！',
            detail: '日曜に加えて、平日などにもう1日休みがある完全週休二日制です。半日勤務2回で1日分とするのではなく、しっかりと「丸一日」のお休みが確保されます。店舗によっては祝日も休みで、年間休日は非常に多くなります。'
        },
        { 
            name: '残業ほぼなし', 
            icon: 'clock', 
            colorClass: 'bg-blue-400', 
            desc: '自分の時間を大切にできます。',
            detail: '月平均残業時間は非常に少なく、定時に帰れる日がほとんど。定時の週40時間に満たない場合でもペナルティはありません。もちろん残業が発生した場合は手当が支給されます。'
        },
        { 
            name: '奨学金返済免除', 
            icon: 'graduation-cap', 
            colorClass: 'bg-green-400', 
            desc: '月5万円貸与＆条件付きで全額返済免除！',
            detail: '在学中に月額5万円の貸与が受けられます。卒業後、貸与期間の2.5倍の期間を勤務していただくと、返済が全額免除となります。アルバイトの時間を勉強に充てて、国家試験合格を目指してください！'
        },
        { 
            name: '有給買取制度', 
            icon: 'briefcase', 
            colorClass: 'bg-purple-400', 
            desc: '時効分の有給を会社が買い取る制度あり。',
            detail: '使いきれずに時効となってしまった有給休暇（通常は消滅してしまうもの）を、会社が買い取る独自の制度があります。頑張りが無駄になりません。'
        },
        { 
            name: '家賃手当あり', 
            icon: 'building-2', 
            colorClass: 'bg-orange-400', 
            desc: '世帯主には家賃手当を支給します。',
            detail: '世帯主の方には毎月家賃手当を支給しています。一人暮らしを始める新卒の方や、家庭を持つスタッフの生活をサポートします。'
        },
        { 
            name: '企業型DC', 
            icon: 'shield-check', 
            colorClass: 'bg-teal-400', 
            desc: '将来のための資産形成もサポート。',
            detail: '企業型確定拠出年金（企業型DC）制度を導入しています。会社が掛け金を拠出し、従業員が運用することで将来の資産形成を支援します。'
        },
    ];

    // 店舗データ
    const areasData = [
        { name: '仙台市青葉区', count: 5, stores: ['立町店', '愛子店', '大町店', '柏木店', '水の森店'] },
        { name: '仙台市太白区', count: 4, stores: ['四郎丸店', '西多賀店', 'あすと長町店', 'ウェル調剤薬局'] },
        { name: '仙台市若林区・宮城野区', count: 2, stores: ['中倉店', '小田原店'] },
        { name: '多賀城市・塩釜市・富谷市', count: 5, stores: ['多賀城店', '城南店', '笠神店', '塩釜店', '上桜木店'] },
    ];


    // --- DOM要素 ---
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const benefitsGrid = document.getElementById('benefitsGrid');
    const areasGrid = document.getElementById('areasGrid');
    
    const modalOverlay = document.getElementById('modalOverlay');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalCloseAction = document.getElementById('modalCloseAction');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalIconBox = document.getElementById('modalIconBox');


    // --- モバイルメニュー制御 ---
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });

        // リンククリック時にメニューを閉じる
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        });
    }


    // --- 福利厚生カード生成 & モーダルイベント ---
    if (benefitsGrid) {
        benefitsData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'benefit-card';
            
            // アイコン部分 (Lucide用の属性を作成)
            // 注: JSで生成後に lucide.createIcons() を再度呼ぶ必要があります
            card.innerHTML = `
                <div class="benefit-header">
                    <div class="benefit-icon ${item.colorClass}">
                        <i data-lucide="${item.icon}"></i>
                    </div>
                    <h4 class="benefit-title">${item.name}</h4>
                    <div class="benefit-arrow">
                        <i data-lucide="arrow-right"></i>
                    </div>
                </div>
                <p class="benefit-desc">${item.desc}</p>
            `;

            // クリックイベント
            card.addEventListener('click', () => {
                openModal(item);
            });

            benefitsGrid.appendChild(card);
        });
    }


    // --- 店舗リスト生成 ---
    if (areasGrid) {
        areasData.forEach(area => {
            const card = document.createElement('div');
            card.className = 'area-card';
            
            const storesHtml = area.stores.map(store => `
                <li><span class="dot"></span>${store}</li>
            `).join('');

            card.innerHTML = `
                <div class="area-header">
                    <h4 class="area-name">${area.name}</h4>
                    <span class="area-count">${area.count}店舗</span>
                </div>
                <ul class="store-list">
                    ${storesHtml}
                </ul>
            `;
            areasGrid.appendChild(card);
        });
    }

    // 動的に追加した要素に対してアイコンを適用
    lucide.createIcons();


    // --- モーダル制御関数 ---
    function openModal(item) {
        modalTitle.textContent = item.name;
        modalBody.textContent = item.detail;
        
        // アイコンの設定
        modalIconBox.className = `modal-icon-box ${item.colorClass}`;
        modalIconBox.innerHTML = `<i data-lucide="${item.icon}"></i>`;
        
        lucide.createIcons({
            root: modalIconBox
        });

        modalOverlay.classList.remove('hidden');
        // 少し遅らせてactiveクラスをつけることでアニメーションさせる
        requestAnimationFrame(() => {
            modalOverlay.classList.add('active');
        });
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        setTimeout(() => {
            modalOverlay.classList.add('hidden');
        }, 300); // transition時間と合わせる
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalCloseAction) modalCloseAction.addEventListener('click', closeModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

});