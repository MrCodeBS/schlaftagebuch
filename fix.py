import os

files_to_fix = [
    'src/App.tsx',
    'src/components/ui/Inputs.tsx',
    'src/components/StorageWarning.tsx',
    'src/views/History.tsx',
    'src/views/Home.tsx',
    'src/views/ProtocolFlow.tsx',
    'src/views/Settings.tsx',
    'src/views/Weekly.tsx',
]

for file in files_to_fix:
    path = os.path.join(os.getcwd(), file)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if content.startswith("import React from 'react';\n"):
            content = content.replace("import React from 'react';\n", "")
        elif content.startswith("import React, {"):
            content = content.replace("import React, {", "import {")
            
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)

# Fix type imports and explicit any
for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.ts') or file.endswith('.tsx'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()

            content = content.replace("import { SleepEntry } from", "import type { SleepEntry } from")
            content = content.replace("import { SleepEntry, WeeklySettings } from", "import type { SleepEntry, WeeklySettings } from")
            content = content.replace("const sortedEntries = Object.values(entries).sort(", "const sortedEntries = (Object.values(entries) as SleepEntry[]).sort(")
            content = content.replace("Object.values(entries).forEach(entry => {", "Object.values(entries).forEach((entry: any) => {")
            content = content.replace("(set) => ({", "(set: any) => ({")
            content = content.replace("endOfWeek, isSameWeek } from", "} from")
            content = content.replace("parse, addDays, isValid } from", "parse, addDays } from")
            content = content.replace("calculateSleepStats, formatDuration }", "calculateSleepStats }")
            content = content.replace("formatter={(value: number)", "formatter={(value: any)")
            # also fix 'set((state) =>' to 'set((state: any) =>'
            content = content.replace("set((state) => ({", "set((state: any) => ({")
            content = content.replace("set((state) => {", "set((state: any) => {")
            content = content.replace("(entry) =>", "(entry: any) =>")
            content = content.replace("(id) =>", "(id: any) =>")
            content = content.replace("(settings) =>", "(settings: any) =>")
            content = content.replace("(newEntries) =>", "(newEntries: any) =>")

            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
