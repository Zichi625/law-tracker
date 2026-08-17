# 勞動法規追蹤 資料更新指示

請依序完成以下步驟，更新 `law-tracker/data/laws.json`：

1. 讀取目前的 `law-tracker/data/laws.json`，記下 `categories` 陣列（分類清單本身不要新增、刪除或修改；使用者若要新增分類會另外明確指示）與現有的 `items`。

2. 針對 `categories` 陣列中列出的「每一個」分類，各自使用網路搜尋，尋找是否有新的法規修正、生效、草案進度等消息。優先參考官方來源（依分類主題選擇相關主管機關，例如：勞動部 mol.gov.tw、全國法規資料庫 law.moj.gov.tw、立法院 ly.gov.tw、職業安全衛生署 osha.gov.tw、行政院 ey.gov.tw、衛生福利部 mohw.gov.tw、中央健康保險署 nhi.gov.tw），其次為可信新聞報導。

3. 對每個分類查到的消息，跟該分類現有的 `items`（比對 `title` 與內容是否描述同一件事）判斷是否為真正尚未收錄的新內容。已經收錄過的消息，即使搜尋結果又出現一次，不要重複新增。

4. 對確認為新的內容，整理成以下格式的物件並加進 `items` 陣列：
   ```js
   {
     id: "唯一字串，建議用「分類id-日期-序號」，例如 workplace-bullying-2026-07-01-1",
     status: "effective｜announced｜draft｜expired 四選一，見下方判斷方式",
     categoryId: "categories 陣列中其中一個分類的 id",
     title: "標題",
     date: "YYYY-MM-DD；若只確定年月，日填該月第一天並在 summary 裡說明日期精確度",
     summary: "白話重點說明，講清楚這條法規/新聞在說什麼",
     employerNotes: "雇主具體要注意、要做什麼",
     employeeNotes: "勞工可以主張什麼權利、要注意什麼期限、遇到狀況可以怎麼做",
     announcedAt: "公布/正式發布日期，YYYY-MM-DD（選填，查得到才寫）",
     effectiveAt: "施行/生效日期，YYYY-MM-DD（選填，查得到才寫；跟 announcedAt 常常不是同一天，兩個都查得到就都寫）",
     sources: [ { label: "來源名稱", url: "來源網址" } ],
     appliesTo: "適用對象（選填，沒有就不要寫這個欄位）",
     penalty: "罰則額度（選填；若不同來源數字有出入，要誠實反映不一致，不要挑一個數字寫得像唯一正確答案）",
     isNew: true,
     addedAt: "本次刷新執行的日期，YYYY-MM-DD"
   }
   ```
   `id`、`status`、`categoryId`、`title`、`date`、`summary`、`employerNotes`、`employeeNotes`、`sources`（至少一筆）為必填。如果查不到至少一個可靠、可點擊查證的來源，這則內容不收錄。

   `announcedAt`／`effectiveAt` 為選填欄位：能從來源查到明確的公布日期或施行日期就填，只查到其中一個就只填那一個，兩個都查不到就都不寫（不要用 `date` 欄位的值去猜）。畫面上會顯示「本站查核」日期，這個是直接用 `addedAt` 的值，不用額外處理。

   `status` 判斷方式（決定網頁上顯示的顏色標籤）：
   - `"effective"`（已生效）：法規／修正已經三讀通過或正式公告，且生效日已經到了（含法院已確定判決、既有現行規定）。
   - `"announced"`（已公告未生效）：已經正式通過並公告，但條文載明的生效日還沒到。
   - `"draft"`（草案研議中）：還在草案、預告、研議、行政院／立法院審議階段，尚未正式三讀通過或公告生效；包含「已通過但尚待另一院會三讀」「主管機關預告修法但尚未確認生效」這類情形。
   - `"expired"`（已失效／已廢止）：曾經生效過，但法源已經到期、廢止，或後續已被其他規定取代、目前已不能適用（例如疫情期間的限時特別條例，期限屆滿後當然廢止）。這類項目仍然收錄（保留歷史脈絡），但要在 `summary` 與 `employerNotes` 裡明確寫清楚「現在已經不適用」，避免使用者誤以為現在還有效。
   如果一則內容單純是「案例／爭議事件」而非法規本身異動（例如勞資爭議個案），依該事件所引用、已經在適用的現行法規判斷，通常標記為 `"effective"`。

5. 把所有既有 `items`（步驟 1 讀到、非本次新增的）的 `isNew` 全部改成 `false`。刷新結束時，`items` 陣列裡應該只有本次新增的項目 `isNew` 為 `true`，其餘全部為 `false`。

6. 把 `law-data.js` 的 `lastRefreshedAt` 更新為本次刷新執行的日期（YYYY-MM-DD）。

7. 完整寫回 `law-tracker/data/laws.json`，維持純 JSON 格式（每個欄位名稱都要用雙引號，最後一個欄位後面不能有逗號，不能寫註解）；`categories` 陣列維持原樣；`items` 陣列 = 既有項目（`isNew` 已重設）+ 本次新增項目，不刪除、不覆蓋任何既有項目。

8. 寫回 `data/laws.json` 後，先驗證檔案是有效的 JSON，不要用有語法錯誤的檔案覆蓋掉：

   ```bash
   node -e "JSON.parse(require('fs').readFileSync('law-tracker/data/laws.json', 'utf8')); console.log('valid JSON')"
   ```

   如果這個指令報錯，代表 JSON 格式寫錯了（通常是漏了引號或多了逗號），要修正到這個指令印出 `valid JSON` 才能繼續。

9. 完成後，用文字跟使用者回報這次刷新的結果：依分類列出這次新增了哪些項目（標題＋一句話摘要）；某分類這次沒有新內容，就直接說「這個分類沒有新消息」。這一步不可省略——刷新是使用者主動要求的，不是排程自動任務。

10. 提醒使用者重新整理瀏覽器頁面，才會看到最新內容。
