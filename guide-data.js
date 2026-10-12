window.LAW_GUIDE_DATA = {
  guides: [
    {
      id: 'leave',
      title: '請假問題',
      cardHint: '病假、婚假、育嬰留職停薪怎麼請、薪水怎麼算',
      intro: '先告訴我們你想了解的是哪一種假，我們會接著問 1 題相關的條件。',
      categoryIds: ['sick-leave', 'marriage-leave', 'parental-leave'],
      questions: [
        {
          id: 'leaveType',
          text: '你想了解的是哪一種假？',
          allowUnsure: true,
          options: [
            { value: 'sick', label: '病假' },
            { value: 'marriage', label: '婚假' },
            { value: 'parental', label: '育嬰留職停薪' }
          ]
        },
        {
          id: 'sickDays',
          text: '這次請假，加上今年已經請過的病假，總共幾天？',
          allowUnsure: true,
          showIf: answers => answers.leaveType === 'sick',
          options: [
            { value: 'within10', label: '10天以內' },
            { value: 'over10', label: '超過10天' }
          ]
        },
        {
          id: 'marriageRegistered',
          text: '2026年10月1日之前，有沒有已經登記結婚、婚假還沒休完？',
          allowUnsure: true,
          showIf: answers => answers.leaveType === 'marriage',
          options: [
            { value: 'yes', label: '有，登記了但假還沒休完' },
            { value: 'no', label: '還沒登記，或打算10月以後登記' }
          ]
        },
        {
          id: 'parentalStage',
          text: '你現在是想申請育嬰留職停薪，還是想知道留停延長草案的進度？',
          allowUnsure: true,
          showIf: answers => answers.leaveType === 'parental',
          options: [
            { value: 'apply', label: '想申請現行制度' },
            { value: 'extension', label: '想知道留停延長草案進度' }
          ]
        }
      ],
      resolve(answers) {
        if (answers.leaveType === 'unsure' || !answers.leaveType) {
          return {
            summary: '你還不確定是哪一種假，以下先列出三種常見假別目前各自的重點，確認之後可以重新作答看更完整的說明。',
            conditions: [],
            missingInfo: ['是哪一種假（病假／婚假／育嬰留職停薪）'],
            employerSteps: [
              '病假：全年10天以內不得作為不利處分理由，全勤獎金要按比例扣，不能整月取消。',
              '婚假：2026年10月1日起婚假由8天延長為14天，新增6天薪資可向勞動部申請補助。',
              '育嬰留職停薪：2026年1月1日起可按日申請、家庭照顧假可以小時計。'
            ],
            employeeSteps: [
              '病假：如果因為請病假被不利對待，舉證責任在雇主，不是你要自己證明清白。',
              '婚假：婚假應自登記日前10日起3個月內請畢，經雇主同意可延到1年內。',
              '育嬰留職停薪：可以按日申請，夫妻可以同時請領津貼。'
            ],
            misconceptions: ['很多人以為三種假的規定是同一套，其實各自的天數、薪資計算、申請方式都不一樣，建議先確認是哪一種再往下看細節。'],
            references: [
              { type: 'law', text: '勞工請假規則第9條、第2條、第12條', detail: '分別規範病假不利處分舉證責任、婚假天數與補助機制。' },
              { type: 'advice', text: '本站實務建議', detail: '先確認假別再查細節，避免套錯規定。' }
            ],
            sources: [],
            verifiedAt: '2026-09-29',
            demo: false
          };
        }
        if (answers.leaveType === 'sick') {
          const over10 = answers.sickDays === 'over10';
          return {
            summary: over10
              ? '病假超過10天之後，10天以內的保障（不得不利處分、全勤獎金按比例扣）仍然適用在那10天身上；超過的天數，公司可以依法請你改請事假或留職停薪、工資計算方式也會不同，建議跟雇主確認超過部分怎麼處理。'
              : '全年病假在10天以內，公司不可以用這個理由做出不利處分（例如降考績、不續聘），全勤獎金也只能按請假天數比例扣減，不能整月整筆取消，這是2026年1月1日起施行的新規定。',
            conditions: [`今年累計病假天數：${answers.sickDays === 'unsure' ? '不確定' : (over10 ? '超過10天' : '10天以內')}`],
            missingInfo: answers.sickDays === 'unsure' ? ['今年累計請了幾天病假，才能確定是否還在10天保障範圍內'] : [],
            employerSteps: [
              '檢查公司現行全勤獎金辦法是不是「一刀切」整月扣除，改成按請假天數比例扣減。',
              '病假10天以內不能作為不利處分（降考績、不續聘等）的理由；如果員工主張被不利對待，公司要自己舉證沒有這樣做。',
              '違反規定最高可能被罰新臺幣100萬元，建議趁機全面檢查相關辦法。'
            ],
            employeeSteps: [
              '如果覺得自己因為請病假被公司不利對待（例如考績被刻意壓低），可以主張新制保障，公司要負舉證責任。',
              '確認公司這個月的全勤獎金扣法，是不是按比例扣而不是整月取消；如果整月取消，可以向當地勞工局反映。'
            ],
            misconceptions: ['「請一天病假全勤獎金就整個月沒了」在2026年之後已經不合法，應該按比例扣；「病假太多就可以考績打差」也不行，10天以內不能作為理由。'],
            references: [
              { type: 'law', text: '勞工請假規則第9條', detail: '2026年1月1日起施行：全年病假10日以內不得作為不利處分事由，舉證責任在雇主；全勤獎金扣減應按請假比例計算。' },
              { type: 'advice', text: '本站實務建議', detail: '建議雇主主動檢查全勤獎金辦法是否已經改成按比例扣減。' }
            ],
            sources: [
              { label: '經理人', url: 'https://www.managertoday.com.tw/articles/view/71422' },
              { label: '104職場力', url: 'https://blog.104.com.tw/qa-about-the-new-regulations-on-sick-leave/' }
            ],
            verifiedAt: '2026-08-13',
            demo: false
          };
        }
        if (answers.leaveType === 'marriage') {
          const alreadyRegistered = answers.marriageRegistered === 'yes';
          return {
            summary: '勞動部已於2026年9月17日預告修正《勞工請假規則》，婚假由現行8天延長為14天，預定2026年10月1日上路，新增的6天薪資雇主先給、再向勞動部申請補助。截至查證當下（2026年9月29日）仍屬「預告」階段，10月1日前仍以正式發布內容為準。',
            conditions: [`10月1日前是否已登記結婚且婚假未休完：${answers.marriageRegistered === 'unsure' ? '不確定' : (alreadyRegistered ? '是' : '否')}`],
            missingInfo: answers.marriageRegistered === 'unsure' ? ['10月1日之前是否已經登記結婚、8天婚假是否已經休完'] : [],
            employerSteps: [
              '10月1日起婚假天數從8天改成14天，記得更新請假系統與相關表單。',
              '新增的第9天到第14天薪資，先照給員工，再向勞動部勞工保險局申請全額補助，不要自己吸收也不要漏了申請。',
              alreadyRegistered
                ? '這位員工10月1日前已登記結婚、8天婚假還沒休完，剩餘天數要直接以新制14天計算，不是只能用舊制8天處理。'
                : '如果員工在10月1日之後才登記結婚，直接適用14天新制即可。'
            ],
            employeeSteps: [
              '10月1日起結婚可以請到14天婚假，多出的6天薪水雇主一樣要全額照給。',
              '婚假應自登記日前10日起3個月內請畢，經雇主同意最長可延到1年內請畢。',
              alreadyRegistered ? '如果你在10月1日前已登記結婚、8天婚假還沒休完，記得跟雇主確認剩餘天數是否已經改用新制14天計算。' : ''
            ].filter(Boolean),
            misconceptions: ['不是「10月1日之後結婚才有14天」，只要10月1日當天8天婚假還沒休完，剩餘部分也能用新制14天計算。'],
            references: [
              { type: 'law', text: '勞工請假規則第2條、第12條（修正中）', detail: '2026年9月17日預告修正，規劃2026年10月1日施行，截至查證當下尚未正式發布。' },
              { type: 'administrative', text: '友善育兒職場婚孕產假薪資補助要點（同步修正中）', detail: '規範雇主如何就新增6天婚假薪資向勞動部勞工保險局申請補助。' }
            ],
            sources: [
              { label: 'ETtoday：勞工婚假要變14天了！勞動部明預告修法「多6天薪水」政府幫忙付', url: 'https://www.ettoday.net/news/20260916/3238829.htm' },
              { label: 'CTWANT：婚假「8天增至14天」10月1日上路！ 勞動部揭1情況已登記也適用', url: 'https://www.ctwant.com/article/500131/' }
            ],
            verifiedAt: '2026-09-29',
            demo: false
          };
        }
        // parental
        if (answers.parentalStage === 'extension') {
          return {
            summary: '育嬰留停延長草案（放寬留停年齡、產假天數等）目前卡在立法院黨團協商階段，截至查證當下（2026年9月29日）沒有排案協商、二讀、三讀的新進度，尚未生效，請不要照草案內容先行承諾員工。',
            conditions: ['關心項目：育嬰留停延長草案進度'],
            missingInfo: ['草案何時排入黨團協商，本站尚無法確認，屬於「待查核」事項，建議刷新時持續追蹤'],
            employerSteps: ['草案尚未三讀通過，現階段仍應依現行規定（按日申請、家庭照顧假以小時計）辦理，不要提前適用草案內容。'],
            employeeSteps: ['草案還沒生效，目前申請育嬰留職停薪仍依現行規定辦理；可以持續留意立法院審議進度。'],
            misconceptions: ['新聞報導「草案已通過行政院」不代表已經生效，還需要經過立法院三讀。'],
            references: [
              { type: 'law', text: '性別平等工作法／就業保險法修正草案', detail: '尚在立法院衛環委員會協商階段，非現行有效規定，列為「待查核」。' }
            ],
            sources: [],
            verifiedAt: '2026-09-29',
            demo: false
          };
        }
        return {
          summary: '育嬰留職停薪現行制度（2026年1月1日起）已經可以按日申請，不用整段請；家庭照顧假也改成以小時計算；夫妻可以同時請領津貼，不用再證明「配偶沒工作」。',
          conditions: ['關心項目：申請現行育嬰留職停薪制度'],
          missingInfo: [],
          employerSteps: ['員工可以按日申請育嬰留職停薪，不用要求對方整段請假；家庭照顧假的請假單位也要改成可以用小時計。'],
          employeeSteps: ['可以按日申請，不用一次請一大段；夫妻可以同時請領津貼，不需要先證明配偶沒有工作。'],
          misconceptions: ['「育嬰留停只能整個月整季請」已經不是現行規定，2026年起可以按日申請。'],
          references: [
            { type: 'law', text: '性別工作平等法相關規定（2026年1月1日起新制）', detail: '按日申請、家庭照顧假以小時計、微型企業獎勵金。' }
          ],
          sources: [],
          verifiedAt: '2026-08-13',
          demo: false
        };
      }
    },
    {
      id: 'overtime',
      title: '加班費怎麼算',
      cardHint: '加班費計算基礎、責任制、下班後聯繫算不算加班',
      intro: '先告訴我們你想確認的是加班費的哪個問題。',
      categoryIds: ['overtime-pay'],
      questions: [
        {
          id: 'overtimeTopic',
          text: '你想確認的是哪個問題？',
          allowUnsure: true,
          options: [
            { value: 'base', label: '加班費的計算基礎是不是只算底薪' },
            { value: 'responsibility', label: '公司說是責任制（84條之1）不用算加班費' },
            { value: 'offhours', label: '下班後用LINE交辦工作算不算加班' }
          ]
        },
        {
          id: 'approved',
          text: '這個職務有沒有向當地勞動局核備84條之1約定書？',
          allowUnsure: true,
          showIf: answers => answers.overtimeTopic === 'responsibility',
          options: [
            { value: 'yes', label: '有核備' },
            { value: 'no', label: '沒有核備，或不確定' }
          ]
        },
        {
          id: 'recorded',
          text: '公司有沒有要求記錄下班後處理公事的起訖時間？',
          allowUnsure: true,
          showIf: answers => answers.overtimeTopic === 'offhours',
          options: [
            { value: 'yes', label: '有在記錄' },
            { value: 'no', label: '沒有，也沒人提過' }
          ]
        }
      ],
      resolve(answers) {
        if (answers.overtimeTopic === 'base' || answers.overtimeTopic === 'unsure' || !answers.overtimeTopic) {
          return {
            summary: '只要是「經常性、固定會發」的錢，像全勤獎金、職務加給、領班加給這類只要員工符合條件就能領、公司也習慣性都會發放的項目，性質上都算是工資，計算加班費時都要算進去，不能用「這是獎金、恩惠性給與」當理由排除。台電就曾經因為漏算全勤獎金和領班加給，被開罰也打輸官司。',
            conditions: [],
            missingInfo: [],
            employerSteps: ['檢查目前計算加班費的基礎薪資，有沒有漏掉全勤獎金、職務加給、領班加給這類經常性給付。'],
            employeeSteps: ['可以自己核對薪資單，看看公司算加班費時有沒有把固定會領的津貼、獎金算進去。'],
            misconceptions: ['「名目上叫獎金、加給就不算工資」是常見誤解，重點看是不是經常性、固定會發放，不是看名稱。'],
            references: [
              { type: 'law', text: '勞動基準法第24條、第40條', detail: '規範加班費計算與例假出勤工資基礎。' },
              { type: 'court', text: '台電加班費漏算案（鏡週刊報導，2026年3月13日）', detail: '法院認定全勤獎金、領班加給屬經常性給付需納入加班費基礎，台電敗訴；報導當時未提供案號，案件可能仍在上訴中，非確定終局判決，僅供參考判斷邏輯。' }
            ],
            sources: [{ label: '鏡週刊', url: 'https://www.mirrormedia.mg/story/20260313edi017' }],
            verifiedAt: '2026-08-13',
            demo: false
          };
        }
        if (answers.overtimeTopic === 'responsibility') {
          const approved = answers.approved === 'yes';
          return {
            summary: '只有經勞動部核定公告的特定工作類型（如監督管理人員、責任制專業人員），才能用84條之1另行約定工時、例假、加班費，但仍要報請地方主管機關核備；勞動部會不定期檢討核定名單，曾把部分職務排除在外，被排除後就要改用一般規定計算加班費。',
            conditions: [`這個職務是否已核備84-1約定書：${answers.approved === 'unsure' ? '不確定' : (approved ? '是' : '否')}`],
            missingInfo: answers.approved === 'unsure' ? ['這個職務有沒有向當地勞動局核備84-1約定書，需要查公司人事資料才能確認'] : [],
            employerSteps: approved
              ? ['雖然已經核備，建議定期確認這個職務名稱還在勞動部最新核定名單內，勞動部曾經把部分職務（如特定委外進用人員）排除在外。']
              : ['沒有核備就不能用84-1規定排除加班費，必須改用一般勞基法規定（正常工時、加班費）計算，建議盡快確認並補正。'],
            employeeSteps: ['可以向公司或當地勞動局確認自己的職務是否真的在84-1核定名單內，如果不在，加班費就要照一般規定計算，不能被公司片面排除。'],
            misconceptions: ['「公司說是責任制就不用算加班費」不一定成立，一定要職務類型在勞動部核定名單內、且已向地方主管機關核備才算數。'],
            references: [
              { type: 'law', text: '勞動基準法第84條之1', detail: '僅限經核定公告的工作者，且須報請地方主管機關核備。' },
              { type: 'administrative', text: '勞動部84條之1工作者核定公告', detail: '核定名單會不定期檢討調整。' }
            ],
            sources: [
              { label: '勞動部公告', url: 'https://www.mol.gov.tw/1607/1632/1640/54659/' },
              { label: '勞動部：勞動基準法第84條之1工作者', url: 'https://www.mol.gov.tw/1607/28162/28166/28218/28222/' }
            ],
            verifiedAt: '2026-08-13',
            demo: false
          };
        }
        // offhours
        const recorded = answers.recorded === 'yes';
        return {
          summary: '只要下班後有實際提供勞務（例如處理訊息、回覆工作事項），全國性的勞基法加班費規定就適用，公司應記錄起訖時間並據以給付加班費。台北市另外訂有「居家工作勞動條件保障指導原則」，但目前只有台北市轄內事業單位適用、不具強制罰則。',
          conditions: [`公司目前是否已在記錄下班後處理公事時間：${answers.recorded === 'unsure' ? '不確定' : (recorded ? '有記錄' : '沒有記錄')}`],
          missingInfo: answers.recorded === 'unsure' ? ['公司是否已有機制記錄下班後聯繫處理公事的時間'] : [],
          employerSteps: recorded
            ? ['既然已經有記錄機制，確認是否確實依記錄到的時間核實給付加班費，不要只記錄不給薪。']
            : ['建議建立下班後聯繫處理公事的起訖時間記錄機制（哪怕只是簡單登記），作為核算加班費的依據，避免爭議時說不清楚。'],
          employeeSteps: ['下班後如果真的有處理公事（不是單純已讀訊息），建議自己也留一份記錄（例如回覆訊息的時間、處理內容），方便之後主張加班費。'],
          misconceptions: ['「只是看一下LINE訊息，沒有真的處理」通常不算加班；但只要有實際處理、回覆工作事項，就算有提供勞務，應該算加班。'],
          references: [
            { type: 'law', text: '勞動基準法第24條', detail: '全國性規定，只要有實際提供勞務就應給付加班費。' },
            { type: 'administrative', text: '臺北市事業單位實施居家工作勞動條件保障指導原則', detail: '僅台北市轄內事業單位適用，不具強制罰則，但判斷標準與其他縣市一致。' }
          ],
          sources: [
            { label: '臺北市政府勞動局：什麼是離線權？', url: 'https://bola.gov.taipei/News_Content.aspx?n=FDEDF5DCB0A26A46&s=07B3539A71359933' }
          ],
          verifiedAt: '2026-08-13',
          demo: false
        };
      }
    },
    {
      id: 'annual-leave',
      title: '特休怎麼算、公司可以拒絕嗎',
      cardHint: '特休買斷、公司不同意排休日期',
      intro: '先告訴我們你遇到的是哪種狀況。',
      categoryIds: ['annual-leave'],
      questions: [
        {
          id: 'annualIssue',
          text: '你遇到的是哪種狀況？',
          allowUnsure: true,
          options: [
            { value: 'buyout', label: '公司想用金錢買斷特休' },
            { value: 'reject', label: '公司不同意我排定的特休日期' }
          ]
        },
        {
          id: 'timing',
          text: '是什麼時間點要買斷？',
          allowUnsure: true,
          showIf: answers => answers.annualIssue === 'buyout',
          options: [
            { value: 'midyear', label: '年度中途（還沒到特休年度結束或離職）' },
            { value: 'yearend', label: '特休年度結束或離職時，沒休完的部分' }
          ]
        },
        {
          id: 'employerReason',
          text: '公司拒絕的理由是什麼？',
          allowUnsure: true,
          showIf: answers => answers.annualIssue === 'reject',
          options: [
            { value: 'busy', label: '只說人手不夠、比較忙' },
            { value: 'negotiated', label: '有具體說明經營困難並找我協商過' }
          ]
        }
      ],
      resolve(answers) {
        if (answers.annualIssue === 'buyout') {
          const midyear = answers.timing !== 'yearend';
          return {
            summary: midyear
              ? '不可以。法律容許把沒休完的特休折算成錢，但僅限「特休年度結束時」或「勞動契約結束（例如離職）當下」兩個時間點。年度中途買斷，就算雙方都同意，法院也認為架空了特休制度的功能，約定不生效力，公司可能被開罰新臺幣2萬到100萬元並公布名稱。'
              : '這個時間點買斷是合法的。特休年度結束時或離職當下，沒休完的特休本來就可以折算成錢，這跟「年度中途買斷」是不同的狀況。',
            conditions: [`買斷時間點：${answers.timing === 'unsure' ? '不確定' : (midyear ? '年度中途' : '年度結束或離職時')}`],
            missingInfo: answers.timing === 'unsure' ? ['公司提出買斷的時間點，是年度中途還是年度結束/離職時，會直接影響是否合法'] : [],
            employerSteps: midyear
              ? ['停止年度中途買斷特休的做法，改成讓員工實際排假休息；真的沒休完的部分，等到年度結束或離職時再合法折算。']
              : ['年度結束或離職時折算特休沒有問題，確認折算金額是否正確（以員工正常工作日工資計算）即可。'],
            employeeSteps: midyear
              ? ['就算你自己同意領錢不休假，這個約定在法律上也不生效力，可以主張仍有權利實際排休；如果公司持續這樣做，可以向當地勞工局反映。']
              : ['可以確認公司折算給你的金額，是不是用你正常工作日的工資計算。'],
            misconceptions: ['很多人以為「雙方都同意」就可以規避規定，但特休買斷的時間點限制是強制規定，同意也沒有用。'],
            references: [
              { type: 'law', text: '勞動基準法第79條', detail: '違反特休相關規定的罰則依據（新臺幣2萬至100萬元，可公布事業單位或負責人姓名）。' },
              { type: 'court', text: '最高行政法院110年度上字第768號判決（2023年5月25日）', detail: '良福保全公司要求員工同意特休年度中途買斷，遭台北市勞動局開罰，最高行政法院駁回上訴、維持原裁罰，確立「特休不得年度中途買斷」見解。' }
            ],
            sources: [
              { label: '司法院判決書查詢系統', url: 'https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&id=TPAA,110,%E4%B8%8A,768,20230525,1' }
            ],
            verifiedAt: '2026-07-16',
            demo: false
          };
        }
        // reject
        const negotiated = answers.employerReason === 'negotiated';
        return {
          summary: '原則上員工自己決定要休哪一天特休。公司要拒絕，必須同時做到兩件事：具體說明企業經營確實面臨迫在眉睫的困難、而且已經實際找員工協商過調整方案；只靠「人手不夠」這種空泛說法站不住腳。',
          conditions: [`公司拒絕理由：${answers.employerReason === 'unsure' ? '不確定' : (negotiated ? '有具體說明並協商過' : '只說人手不夠')}`],
          missingInfo: answers.employerReason === 'unsure' ? ['公司拒絕時有沒有具體說明經營困難、有沒有實際協商過'] : [],
          employerSteps: negotiated
            ? ['就算已經說明困難並協商過，建議把協商過程留下書面紀錄，避免日後爭議時舉證困難。']
            : ['只用「人手不夠」這種空泛理由拒絕員工排定的特休日期，站不住腳，建議具體說明經營困難並主動找員工協商替代方案，同時在請假辦法裡訂好合理的申請提前天數。'],
          employeeSteps: negotiated
            ? ['公司已經具體說明並協商過，建議一起討論可行的替代日期；如果協商過程中條件不合理，仍可以向當地勞工局申訴。']
            : ['如果公司只說「人手不夠」就拒絕，沒有具體說明困難也沒有協商過，可以主張自己有權利休那一天，並向當地勞工局反映。'],
          misconceptions: ['「公司說不行就不行」不是正確做法，拒絕有法定門檻；但員工臨時才申請（沒有提前合理天數）也可能被認為濫用權利，建議雙方都依公司請假辦法的提前天數規定。'],
          references: [
            { type: 'law', text: '勞動基準法第38條第2項', detail: '雇主因企業經營上急迫需求得與勞工協商調整，但須符合法定要件。' },
            { type: 'court', text: '最高行政法院109年度上字第111號判決（2021年5月20日，長榮航空案）', detail: '確立「特休排定權原則上屬於勞工，雇主須同時符合急迫需求與已協商兩項要件才能拒絕」的見解；本案後來發回台北高等行政法院更審，原裁罰是否維持尚無公開結案資料可確認。' }
          ],
          sources: [
            { label: '司法院法學資料檢索系統', url: 'https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&id=TPAA,109,%E4%B8%8A,111,20210520,1' }
          ],
          verifiedAt: '2026-07-16',
          demo: false
        };
      }
    },
    {
      id: 'termination',
      title: '終止契約（資遣／試用期）',
      cardHint: '資遣費、自願離職、試用期終止契約',
      intro: '先告訴我們是哪一種終止契約的情況。',
      categoryIds: ['severance-pay', 'labor-contract-probation'],
      questions: [
        {
          id: 'terminationType',
          text: '是哪一種終止契約的情況？',
          allowUnsure: true,
          options: [
            { value: 'severance', label: '公司要資遣員工（或我被資遣）' },
            { value: 'probation', label: '員工還在試用期，想終止契約' }
          ]
        },
        {
          id: 'severanceConcern',
          text: '你比較想確認的是哪一點？',
          allowUnsure: true,
          showIf: answers => answers.terminationType === 'severance',
          options: [
            { value: 'fakeresign', label: '公司要求簽自願離職，不開非自願離職證明' },
            { value: 'relocation', label: '公司遷廠，通勤變超遠算不算資遣' },
            { value: 'nopay', label: '公司快經營不下去，擔心領不到資遣費' }
          ]
        }
      ],
      resolve(answers) {
        if (answers.terminationType === 'probation') {
          return {
            summary: '這點主管機關（勞動部）與法院實務見解不一致：勞動部函釋認為試用期員工終止契約仍要符合勞基法第11、12條法定事由，該有的預告期間、資遣費、謀職假都不能少；但法院多數判決傾向認定試用期是「正式締約前的觀察評估階段」，雇主有比較大的裁量空間，不見得都要符合法定資遣事由或給付資遣費。基於風險考量，建議採取較保守的做法。',
            conditions: [],
            missingInfo: [],
            employerSteps: ['基於風險考量，建議仍依勞動部函釋見解，走正式資遣程序（符合勞基法第11或12條事由）並發放資遣費，比較保守安全，避免事後被認定違法。'],
            employeeSteps: ['如果在試用期被不錄用、沒拿到資遣費，可以主張勞動部函釋見解（仍需符合法定資遣事由並給付資遣費），但要知道法院實務上多數見解與主管機關不同，最後結果仍會依個案審理而定，建議尋求法律諮詢或向當地勞工局申訴。'],
            misconceptions: ['「試用期內解僱比較有彈性、不用給資遣費」是常見但有風險的說法——這是主管機關與法院看法不一致的灰色地帶，不是確定答案。'],
            references: [
              { type: 'administrative', text: '勞動部函釋（新北勞動雲轉載）', detail: '試用期員工終止契約仍須依勞基法第11、12條辦理，含預告期間、資遣費、謀職假。' },
              { type: 'court', text: '法院多數判決見解（立法院法制局2022年8月研析報告整理）', detail: '傾向認定試用期屬觀察評估階段，雇主裁量空間較大，不見得須符合法定資遣事由；僅為多數見解，非絕對規則，個案結果仍待法院審理。' }
            ],
            sources: [
              { label: '新北勞動雲：勞動部有關勞工與雇主約定合理試用期間之勞動權益', url: 'https://ilabor.ntpc.gov.tw/news/release/content/991692845?showType=' },
              { label: '立法院：勞工試用期法律性質之研析', url: 'https://www.ly.gov.tw/Pages/Detail.aspx?nodeid=6590&pid=220489' }
            ],
            verifiedAt: '2026-07-16',
            demo: false
          };
        }
        if (answers.terminationType === 'unsure' || !answers.terminationType) {
          return {
            summary: '終止契約的狀況分成好幾種，條件不一樣，建議先確認是「一般資遣」還是「試用期終止」，才能看到對應的詳細說明。',
            conditions: [],
            missingInfo: ['是一般資遣，還是試用期終止契約'],
            employerSteps: ['不管哪一種狀況，開立非自願離職證明、足額給付資遣費都是基本原則，不要用「自願離職」規避。'],
            employeeSteps: ['可以先確認自己是一般員工被資遣，還是還在試用期內，兩種狀況的法律見解不太一樣。'],
            misconceptions: [],
            references: [{ type: 'advice', text: '本站實務建議', detail: '先確認狀況類型再查細節，避免套錯規定。' }],
            sources: [],
            verifiedAt: '2026-09-29',
            demo: false
          };
        }
        // severance
        const concern = answers.severanceConcern;
        if (concern === 'relocation') {
          return {
            summary: '公司遷廠造成通勤時間大增，這牽涉公司單方面調動員工的合法性判斷，通常看兩件事：這次調動有沒有實際營運需要、調動後工作條件會不會明顯變糟。如果通勤時間大幅拉長，公司應該主動提供補救措施（例如交通補助、彈性上下班），而不是放任員工自己承擔；配套不足時，員工可以拒絕這次調動。',
            conditions: ['關心項目：遷廠通勤變遠是否算資遣'],
            missingInfo: [],
            employerSteps: ['遷廠前評估對員工通勤的實際影響，主動提供交通補助或彈性上下班等配套措施；如果是想藉調動逼員工自行離職、規避資遣費，一旦被認定手法不正當，公司會被裁罰。'],
            employeeSteps: ['如果公司遷廠導致通勤時間大幅增加、又沒有提供任何補救措施，可以主張拒絕這次調動；如果覺得公司是藉此逼你自行離職，可以向當地勞工局申訴。'],
            misconceptions: ['「公司說要遷廠，員工就只能自己想辦法通勤」不一定對，調動合法性有法定要件，配套不足可以拒絕。'],
            references: [{ type: 'law', text: '勞動基準法第10條之1', detail: '雇主調動勞工工作應符合之原則（調動合法性五大原則）。' }],
            sources: [
              { label: '聯合新聞網', url: 'https://udn.com/news/story/7269/9144628' },
              { label: '經濟日報', url: 'https://money.udn.com/money/story/122328/9144628' }
            ],
            verifiedAt: '2026-07-16',
            demo: false
          };
        }
        if (concern === 'nopay') {
          return {
            summary: '如果雇主歇業、清算或宣告破產，積欠員工的資遣費、退休金或工資，可以由「積欠工資墊償基金」先代墊，現行規定僅保障往前推6個月內積欠的部分。勞動部正研議將追溯期間延長為5年，但截至查證當下尚未確認是否已正式生效。',
            conditions: ['關心項目：公司可能付不出資遣費'],
            missingInfo: ['「追溯期延長為5年」的修法是否已正式生效，目前仍列為「待查核」，以查核當下（2026年9月）全國法規資料庫內容為準仍是6個月'],
            employerSteps: ['平時就把資遣費依法按時足額結清，避免累積成日後可能被追討、甚至墊償基金追償的舊帳。'],
            employeeSteps: ['公司真的倒閉、積欠資遣費時，可以向勞保局申請「積欠工資墊償基金」代墊，目前規定是往前推6個月內積欠的部分，建議直接向勞保局確認最新適用範圍。'],
            misconceptions: ['不要誤以為公司倒閉就完全領不到資遣費，墊償基金是一個救濟管道，但保障範圍目前仍有6個月的限制。'],
            references: [{ type: 'law', text: '積欠工資墊償基金提繳及墊償管理辦法', detail: '現行保障往前推6個月內積欠部分；5年延長修法截至查證當下尚未確認生效，列為待查核。' }],
            sources: [
              { label: '中央社', url: 'https://www.cna.com.tw/news/ahel/202408020146.aspx' },
              { label: '經濟日報', url: 'https://money.udn.com/money/story/7307/8135993' }
            ],
            verifiedAt: '2026-09-29',
            demo: false
          };
        }
        // fakeresign (default)
        return {
          summary: '不建議要求員工簽「自願離職」來規避資遣費。如果公司要求員工簽自願離職同意書、不開立非自願離職證明，目的是規避資遣費或讓員工無法申請失業給付，一旦被查獲，公司可能面臨裁罰。正確做法是依法開立非自願離職證明，並足額給付資遣費。',
          conditions: ['關心項目：公司要求簽自願離職'],
          missingInfo: [],
          employerSteps: ['不要用「自願離職」規避資遣費與失業給付義務，依法開立非自願離職證明、足額給付資遣費，避免被查獲後面臨裁罰。'],
          employeeSteps: ['如果公司要求你簽「自願離職」但實際上是被迫離職，可以拒絕簽署，並主張開立非自願離職證明，以便申請失業給付；如有疑慮可向當地勞工局申訴或申請調解。'],
          misconceptions: ['「只要員工簽了自願離職，公司就沒有資遣費義務」不代表這份文件在法律上就一定有效，如果實際上是被迫或規避義務，仍可能被認定違法。'],
          references: [{ type: 'law', text: '勞工退休金條例第45-1條', detail: '規範雇主不得以不實方式規避資遣費給付義務。' }],
          sources: [
            { label: '聯合新聞網', url: 'https://udn.com/news/story/7269/9144628' },
            { label: '經濟日報', url: 'https://money.udn.com/money/story/122328/9144628' },
            { label: 'TVBS新聞網', url: 'https://news.tvbs.com.tw/life/3046890' }
          ],
          verifiedAt: '2026-07-16',
          demo: false
        };
      }
    },
    {
      id: 'contractor',
      title: '僱傭與承攬的認定',
      cardHint: '合約寫承攬、委任，到底算不算員工',
      intro: '先告訴我們你想確認的是哪一項。',
      categoryIds: ['contractor-classification'],
      questions: [
        {
          id: 'contractorConcern',
          text: '你想確認的是哪一項？',
          allowUnsure: true,
          options: [
            { value: 'noinsurance', label: '合約寫承攬／委任，公司說不用幫忙保勞健保' },
            { value: 'selfcheck', label: '想知道怎麼自我檢查比較像承攬還是員工' },
            { value: 'consequence', label: '想知道被認定「假承攬真僱傭」會有什麼後果' }
          ]
        },
        {
          id: 'controlLevel',
          text: '對方（發案方）會不會要求你配合固定班表、地點，或用他指定的方式工作？',
          allowUnsure: true,
          showIf: () => true,
          options: [
            { value: 'yes', label: '會，蠻多限制的' },
            { value: 'no', label: '不太會，我自己決定怎麼做' }
          ]
        }
      ],
      resolve(answers) {
        const controlled = answers.controlLevel === 'yes';
        const controlNote = answers.controlLevel === 'unsure'
          ? '你還不確定對方要求配合的程度，建議對照下面的檢核重點逐項確認。'
          : (controlled
            ? '你提到對方會要求配合固定班表、地點或指定做法，這些都偏向「人格從屬性」的特徵，傾向被認定為僱傭關係，就算合約名稱寫承攬，也可能要適用勞基法。'
            : '你提到自己可以決定怎麼做，這比較偏向真正的承攬關係，但仍要整體考量報酬方式、設備由誰提供等其他因素，不是單一條件就能下定論。');

        const base = {
          conditions: [`合作方式是否要求配合固定班表/地點/做法：${answers.controlLevel === 'unsure' ? '不確定' : (controlled ? '是' : '否')}`],
          missingInfo: answers.controlLevel === 'unsure' ? ['對方是否要求配合固定班表、地點或指定工作方式'] : [],
          misconceptions: ['合約上寫「承攬」或「委任」不是重點，關鍵要看雙方實際合作的方式，不是合約名稱。'],
          sources: [],
          verifiedAt: '2026-07-16',
          demo: false
        };

        if (answers.contractorConcern === 'selfcheck') {
          return Object.assign({}, base, {
            summary: `可以參考勞動部公布的25項從屬性檢核表自我檢視，重點放在：對方要不要配合排定的班表和地點上班、能不能自己決定工作流程和方法、要不要親自執行不能找人代做、用的設備工具是誰提供、報酬怎麼算是不是單方決定、有沒有要跟其他員工協同合作。符合的項目越多，就越傾向是僱傭而非承攬。${controlNote}`,
            employerSteps: ['發包前先用勞動部的從屬性檢核表自我檢視，符合項目越多，越可能被認定為僱傭關係，建議簽約前就依勞基法規定辦理投保與提繳，比事後被認定違法再補救省事。'],
            employeeSteps: ['可以對照勞動部的檢核表項目逐一確認自己的合作狀況，符合越多項目，越有機會主張自己其實是僱傭關係，應該享有勞基法保障。'],
            references: [
              { type: 'administrative', text: '勞動部勞動契約認定指導原則（含25項從屬性檢核表）', detail: '108年11月19日勞動關2字第1080128698號函。' }
            ]
          }, { sources: [{ label: '勞動部：勞動契約認定指導原則（含檢核表PDF）', url: 'https://www.mol.gov.tw/media/seljrmqo/%E5%8B%9E%E5%8B%95%E5%A5%91%E7%B4%84%E8%AA%8D%E5%AE%9A%E6%8C%87%E5%B0%8E%E5%8E%9F%E5%89%87.pdf?mediaDL=true' }] });
        }

        if (answers.contractorConcern === 'consequence') {
          return Object.assign({}, base, {
            summary: `曾有貨運公司合約寫「承攬」、報酬按趟計算，但法院審理後認定實質是僱傭關係——車輛由公司配發、路線由公司安排、用GPS和行車紀錄追蹤考核、請假要先報備。一旦被認定假承攬真僱傭，公司除了要付資遣費、未休特休折算工資，過去欠繳的勞健保差額、勞退提繳缺口也要一次補上，比當初依法投保還貴，還要負擔訴訟成本。${controlNote}`,
            employerSteps: ['與其事後被認定違法要一次補繳勞健保差額、勞退提繳缺口並支付資遣費，不如簽約前就先用從屬性檢核表評估，偏向僱傭關係就直接依勞基法辦理。'],
            employeeSteps: ['如果合作方式很像被認定僱傭關係的這些特徵（公司配發設備、安排路線、GPS追蹤考核、請假要報備），可以保留相關紀錄（通訊紀錄、派工單、考核紀錄），作為日後主張僱傭關係的證據。'],
            references: [
              { type: 'court', text: '最高法院111年度台上字第2460號判決', detail: '貨運駕駛合約名稱為「承攬」，法院認定實質為僱傭關係，雇主須給付資遣費、未休特休折算工資、補繳勞健保差額與勞退提繳。' }
            ]
          }, { sources: [{ label: '法律人 LawPlayer：最高法院111年度台上字第2460號判決', url: 'https://lawplayer.com/judgment/TPSV,111,%E5%8F%B0%E4%B8%8A,2460,20221117,1_b4a143d4273aa743e8235588161d16daab27453d' }] });
        }

        // noinsurance / unsure default
        return Object.assign({}, base, {
          summary: `合約上寫「承攬」或「委任」，不代表就不用保勞健保、提繳勞退。關鍵要看雙方實際合作的方式：對方要不要聽安排工時和工作方法（人格從屬性）、能不能自己決定怎麼做、要不要自負盈虧（經濟從屬性）、有沒有被納入公司的組織分工（組織從屬性）。只要實際運作偏向這些特徵，就算合約名稱是承攬，仍可能被認定為僱傭關係，一樣要適用勞基法。${controlNote}`,
          employerSteps: ['不要單純以合約名稱（承攬/委任）作為不投保勞健保、不提繳勞退的依據，先用從屬性檢核表評估實際合作方式。'],
          employeeSteps: ['如果對方要求配合固定班表、指定工作方式，不代表你一定沒有勞健保、勞退的權益，可以進一步對照從屬性判斷標準確認。'],
          references: [
            { type: 'administrative', text: '勞動部勞動契約認定指導原則', detail: '108年11月19日勞動關2字第1080128698號函，從人格、經濟、組織三種從屬性判斷實質關係。' }
          ]
        }, { sources: [{ label: '勞動部：勞動部訂定「勞動契約認定指導原則」', url: 'https://www.mol.gov.tw/announcement/2099/42678/' }] });
      }
    }
  ]
};
