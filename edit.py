import os

def replace_in_file(file, old, new):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content.replace(old, new))

# 1. Update App.tsx routing
replace_in_file('src/App.tsx', '<Route path="/protocol/:type" element={<ProtocolFlow />} />', '<Route path="/protocol/:type/:date?" element={<ProtocolFlow />} />')

# 2. Update ProtocolFlow.tsx to accept :date
replace_in_file('src/views/ProtocolFlow.tsx', "const { type } = useParams<{ type: 'evening' | 'morning' }>();", "const { type, date } = useParams<{ type: 'evening' | 'morning', date?: string }>();")

replace_in_file('src/views/ProtocolFlow.tsx', "const targetDate = isMorning ? format(subDays(new Date(), 1), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');", "const targetDate = date || (isMorning ? format(subDays(new Date(), 1), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'));")

replace_in_file('src/views/ProtocolFlow.tsx', """if (isMorning) {
      setShowSummary(true);
    } else {
      navigator('/');
    }""", """if (isMorning) {
      setShowSummary(true);
    } else {
      if (date) navigator('/protocol/morning/' + date);
      else navigator('/');
    }""")

# Use history as fallback for Summary OK button if date is present
replace_in_file('src/views/ProtocolFlow.tsx', "onClick={() => navigator('/')}", "onClick={() => navigator(date ? '/history' : '/')}")

# 3. Update History.tsx to allow clicking on a day to edit
replace_in_file('src/views/History.tsx', "import { useState } from 'react';", "import { useState } from 'react';\nimport { useNavigate } from 'react-router-dom';")
replace_in_file('src/views/History.tsx', "const { entries, saveEntry } = useStore();", "const { entries, saveEntry } = useStore();\n  const navigate = useNavigate();")
replace_in_file('src/views/History.tsx', "key={entry.id} className=\"bg-white dark:bg-gray-800", "key={entry.id} onClick={() => navigate('/protocol/evening/' + entry.id)} className=\"cursor-pointer bg-white dark:bg-gray-800")
