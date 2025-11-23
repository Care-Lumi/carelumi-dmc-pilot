# 🚀 CareLumi DMC Pilot - Deployment Guide

## **📋 Pre-Deployment Checklist**

### ✅ **1. Environment Variables (Vercel)**

All 5 variables are already configured in your Vercel project settings! ✅

Verify at: https://vercel.com/your-account/carelumi-dmc-pilot/settings/environment-variables

```
✅ NEXT_PUBLIC_ELEVENLABS_API_KEY
✅ NEXT_PUBLIC_ELEVENLABS_AGENT_ID  
✅ GOOGLE_AI_API_KEY
✅ NEXT_PUBLIC_PILOT_MODE
✅ AI_GATEWAY_API_KEY
```

### ✅ **2. Dependencies**

Install Google Generative AI package:

```bash
npm install @google/generative-ai@^0.21.0
```

or if using pnpm:

```bash
pnpm install @google/generative-ai@^0.21.0
```

---

## **🔧 Local Development Setup**

### **Step 1: Copy Environment Variables**

```bash
cp .env.local.template .env.local
```

The `.env.local` file is already populated with your API keys.

### **Step 2: Install Dependencies**

```bash
npm install
# or
pnpm install
```

### **Step 3: Run Development Server**

```bash
npm run dev
# or
pnpm dev
```

Open http://localhost:3000 in your browser.

### **Step 4: Test Features**

- ✅ Sample data banner appears
- ✅ Click "Chat with Clip" → ElevenLabs widget loads
- ✅ Click upload button → Document classification works
- ✅ Remove sample data → Dashboard shows empty state

---

## **🚀 Deploy to Vercel**

### **Method 1: Git Push (Recommended)**

```bash
# Commit your changes
git add .
git commit -m "Add DMC pilot features: ElevenLabs, document upload, sample data"

# Push to your GitHub repo
git push origin main
```

Vercel will automatically deploy! 🎉

**Deployment URL:** `https://carelumi-dmc-pilot.vercel.app`

### **Method 2: Vercel CLI**

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Deploy
vercel --prod
```

---

## **✅ Post-Deployment Verification**

### **1. Test Deployed Site**

Visit: https://carelumi-dmc-pilot.vercel.app

**Check:**
- ✅ Sample data banner shows
- ✅ Dashboard displays DMC Inc branding
- ✅ "John Cavanagh" appears as user
- ✅ 3 sample documents visible

### **2. Test Clip (ElevenLabs)**

**Steps:**
1. Click floating "Chat with Clip" button
2. Modal should open with ElevenLabs widget
3. Try voice or text: "What documents do surgery centers need in Texas?"
4. Clip should respond with compliance guidance

**Troubleshooting:**
- If widget doesn't load → Check browser console for API key errors
- If "API key invalid" → Verify environment variables in Vercel settings
- If agent doesn't respond → Check ElevenLabs agent status at https://elevenlabs.io/app/conversational-ai

### **3. Test Document Upload**

**Steps:**
1. Click "Upload Document" button
2. Upload a test PDF/image of a license
3. Wait for AI classification (5-10 seconds)
4. Check if document details are extracted correctly

**Test Files:**
- Use any healthcare license PDF
- Or take a photo of a physical license
- Or use sample documents from `/public/test-documents/` (if available)

**Troubleshooting:**
- If upload fails → Check Vercel logs (Vercel dashboard → Functions tab)
- If classification is wrong → Check `/api/classify-document` logs
- If "API quota exceeded" → Check Google Cloud credits usage

### **4. Test Sample Data Removal**

**Steps:**
1. Click "Remove Sample Data" button
2. Dashboard should show empty state
3. Click "Restore Sample Data" button
4. 3 sample documents should reappear

---

## **🐛 Common Issues & Solutions**

### **Issue: Environment Variables Not Working**

**Solution:**
1. Go to Vercel → Settings → Environment Variables
2. Ensure all 5 variables are set for "Production", "Preview", AND "Development"
3. Redeploy: Vercel → Deployments → Click "..." → "Redeploy"

### **Issue: ElevenLabs Widget Not Loading**

**Check:**
1. Browser console for errors
2. Verify NEXT_PUBLIC_ELEVENLABS_API_KEY starts with `sk_`
3. Verify NEXT_PUBLIC_ELEVENLABS_AGENT_ID starts with `agent_`
4. Check https://elevenlabs.io/app/conversational-ai → Your agent should be "Published"

**Fix:**
```bash
# In Vercel dashboard
Settings → Environment Variables → Edit NEXT_PUBLIC_ELEVENLABS_API_KEY
# Make sure the value is correct (no extra spaces)
```

### **Issue: Document Classification Fails**

**Check:**
1. Vercel → Functions → Runtime Logs
2. Look for errors in `/api/classify-document`
3. Verify GOOGLE_AI_API_KEY is correct
4. Check Google Cloud Console → Vertex AI → Quotas

**Fix:**
```bash
# Test API key locally
curl "https://generativelanguage.googleapis.com/v1/models?key=YOUR_API_KEY"
# Should return list of models, not an error
```

### **Issue: "Failed to classify document" Error**

**Possible Causes:**
1. File too large (>10MB)
2. Unsupported file type (not PDF/JPG/PNG)
3. Gemini API quota exceeded
4. Invalid API key

**Solution:**
- Check file size: Max 10MB
- Check file type: Must be PDF, JPG, or PNG
- Check Google Cloud billing: Ensure credits are active
- Test with smaller file first

---

## **📊 Monitoring & Analytics**

### **Vercel Analytics**

View deployment metrics:
- https://vercel.com/your-account/carelumi-dmc-pilot/analytics

**Key Metrics:**
- Page load time
- API route performance
- Error rates
- User sessions

### **API Usage Tracking**

**ElevenLabs:**
- Dashboard: https://elevenlabs.io/app/usage
- Credits remaining: 33M (should last months)
- Cost per conversation: ~1,000 credits

**Google Cloud (Gemini):**
- Console: https://console.cloud.google.com/apis/dashboard
- Credits remaining: $2,500
- Cost per document: ~$0.00454 (15 pages)

---

## **🔐 Security Best Practices**

### **1. Never Commit Secrets**

❌ **Don't:**
```bash
git add .env.local  # NEVER DO THIS
```

✅ **Do:**
```bash
# .gitignore already includes:
.env.local
.env*.local
```

### **2. Rotate API Keys Regularly**

**Schedule:**
- Every 90 days: Rotate ElevenLabs API key
- Every 180 days: Rotate Google AI API key

**Process:**
1. Generate new key in respective dashboard
2. Update Vercel environment variables
3. Redeploy
4. Delete old key after 24 hours

### **3. Monitor API Usage**

Set up alerts for:
- Unexpected API spikes
- Quota warnings (80% used)
- Failed authentication attempts

---

## **📞 Support & Troubleshooting**

### **Quick Links:**

- **Vercel Logs:** https://vercel.com/your-account/carelumi-dmc-pilot/logs
- **ElevenLabs Dashboard:** https://elevenlabs.io/app
- **Google Cloud Console:** https://console.cloud.google.com
- **GitHub Repo:** [Your repo URL]

### **Getting Help:**

1. Check this guide first
2. Review Vercel deployment logs
3. Check browser console for client-side errors
4. Test API endpoints directly

---

## **🎯 Success Criteria**

Your deployment is successful when:

✅ Sample data banner appears on dashboard  
✅ "DMC Inc" and "John Cavanagh" branding visible  
✅ Clip chat opens and responds to questions  
✅ Document upload works and classifies correctly  
✅ Sample data can be removed and restored  
✅ No console errors on page load  
✅ All 3 sample documents display correctly  

---

## **🔄 Next Steps After Deployment**

1. **Share with John:** Send him the Vercel URL
2. **Onboarding Call:** Walk John through features
3. **Collect Feedback:** Ask what he likes/wants changed
4. **Monitor Usage:** Check API consumption daily
5. **Plan Phase 2:** Discuss which features to add next

---

**Deployment URL:** https://carelumi-dmc-pilot.vercel.app

**Ready to deploy? Let's go! 🚀**
