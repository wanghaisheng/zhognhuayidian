---
name: fit-scorer
description: Evaluates and scores influencer-brand alignment using weighted criteria including audience match, content quality, brand values, engagement authenticity, and partnership potential. Essential for prioritizing outreach.
---

# Fit Scorer

This skill helps you objectively evaluate how well an influencer matches your brand by scoring them across multiple dimensions. It transforms subjective "gut feel" into data-driven partnership decisions.

## When to Use This Skill

- Prioritizing influencers from a discovery list
- Deciding between multiple candidates for a campaign
- Justifying influencer selection to stakeholders
- Creating consistent evaluation standards
- Comparing influencers across different niches or platforms
- Building long-term partner tiers

## What This Skill Does

1. **Multi-Dimensional Scoring**: Evaluates across audience, content, brand, engagement
2. **Weighted Analysis**: Applies custom weights based on campaign priorities
3. **Authenticity Check**: Assesses follower quality and engagement authenticity
4. **Risk Assessment**: Identifies potential brand safety concerns
5. **Comparative Ranking**: Ranks multiple influencers against each other
6. **ROI Prediction**: Estimates potential performance and value

## How to Use

### Score a Single Influencer

```
Score @[handle] for [brand/campaign] and tell me if they're a good fit
```

### Compare Multiple Influencers

```
Compare and rank these influencers for [campaign]:
- @influencer1
- @influencer2
- @influencer3
```

### Custom Criteria

```
Score these influencers with emphasis on [engagement/audience match/content quality]:
[list of influencers]
```

## Instructions

When a user requests influencer scoring:

1. **Define Scoring Framework**

   ```markdown
   ### Scoring Framework
   
   **Brand/Campaign**: [name]
   **Campaign Goal**: [awareness/consideration/conversion]
   **Target Audience**: [description]
   
   ### Scoring Dimensions
   
   | Dimension | Weight | Description |
   |-----------|--------|-------------|
   | Audience Match | [%] | How well their audience matches target |
   | Content Quality | [%] | Production value and consistency |
   | Brand Alignment | [%] | Values, aesthetic, messaging fit |
   | Engagement Quality | [%] | Authenticity and depth of engagement |
   | Partnership Potential | [%] | Professionalism, history, availability |
   | **Total** | **100%** | |
   
   **Scoring Scale**: 1-5 (1=Poor, 2=Below Average, 3=Average, 4=Good, 5=Excellent)
   ```

2. **Score Audience Match**

   ```markdown
   ## Audience Match Score
   
   **Influencer**: @[handle]
   
   ### Target vs. Actual Comparison
   
   | Attribute | Target | Influencer's Audience | Match |
   |-----------|--------|----------------------|-------|
   | Age | [target] | [actual] | ✅/⚠️/❌ |
   | Gender | [target] | [actual] | ✅/⚠️/❌ |
   | Location | [target] | [actual] | ✅/⚠️/❌ |
   | Interests | [target] | [actual] | ✅/⚠️/❌ |
   | Income/Purchasing | [target] | [actual] | ✅/⚠️/❌ |
   
   ### Audience Quality Assessment
   
   | Metric | Value | Assessment |
   |--------|-------|------------|
   | Real follower % | [%] | [Good/Concerning] |
   | Active follower % | [%] | [Good/Concerning] |
   | Bot/spam % | [%] | [Good/Concerning] |
   | Audience growth | [trend] | [Organic/Suspicious] |
   
   ### Audience Match Score: [X/5]
   
   **Justification**: [explanation]
   
   **Weighted Score**: [X] × [weight%] = [weighted points]
   ```

3. **Score Content Quality**

   ```markdown
   ## Content Quality Score
   
   **Influencer**: @[handle]
   
   ### Production Quality
   
   | Factor | Rating | Notes |
   |--------|--------|-------|
   | Visual quality | [1-5] | [notes] |
   | Audio quality (if video) | [1-5] | [notes] |
   | Editing skill | [1-5] | [notes] |
   | Creativity | [1-5] | [notes] |
   | Consistency | [1-5] | [notes] |
   
   ### Content Analysis
   
   **Posting Frequency**: [X posts/week]
   **Content Mix**: [types and %]
   **Caption Quality**: [assessment]
   **Hashtag Strategy**: [assessment]
   
   ### Best Content Examples
   
   1. **[Content 1]**: [why it's good]
   2. **[Content 2]**: [why it's good]
   
   ### Content Concerns
   
   - [Concern 1 if any]
   - [Concern 2 if any]
   
   ### Content Quality Score: [X/5]
   
   **Justification**: [explanation]
   
   **Weighted Score**: [X] × [weight%] = [weighted points]
   ```

4. **Score Brand Alignment**

   ```markdown
   ## Brand Alignment Score
   
   **Influencer**: @[handle]
   
   ### Value Alignment
   
   | Brand Value | Influencer Alignment | Evidence |
   |-------------|---------------------|----------|
   | [Value 1] | ✅/⚠️/❌ | [example from content] |
   | [Value 2] | ✅/⚠️/❌ | [example from content] |
   | [Value 3] | ✅/⚠️/❌ | [example from content] |
   
   ### Aesthetic Alignment
   
   | Element | Brand Style | Influencer Style | Match |
   |---------|-------------|------------------|-------|
   | Colors | [brand] | [influencer] | [%] |
   | Tone | [brand] | [influencer] | [%] |
   | Visual style | [brand] | [influencer] | [%] |
   
   ### Messaging Fit
   
   - **Voice compatibility**: [assessment]
   - **Topic relevance**: [assessment]
   - **Audience overlap**: [assessment]
   
   ### Brand Safety Check
   
   | Risk Category | Assessment | Notes |
   |---------------|------------|-------|
   | Political content | [Low/Medium/High] | [notes] |
   | Controversial opinions | [Low/Medium/High] | [notes] |
   | Competitor mentions | [Low/Medium/High] | [notes] |
   | Adult content | [Low/Medium/High] | [notes] |
   | Legal/regulatory | [Low/Medium/High] | [notes] |
   
   **Overall Brand Safety**: [Safe/Proceed with caution/Risk]
   
   ### Brand Alignment Score: [X/5]
   
   **Justification**: [explanation]
   
   **Weighted Score**: [X] × [weight%] = [weighted points]
   ```

5. **Score Engagement Quality**

   ```markdown
   ## Engagement Quality Score
   
   **Influencer**: @[handle]
   
   ### Engagement Metrics
   
   | Platform | Followers | Eng. Rate | Industry Avg | vs. Avg |
   |----------|-----------|-----------|--------------|---------|
   | [Platform 1] | [count] | [%] | [%] | [+/-] |
   | [Platform 2] | [count] | [%] | [%] | [+/-] |
   
   ### Engagement Authenticity
   
   | Indicator | Assessment | Evidence |
   |-----------|------------|----------|
   | Comment quality | [1-5] | [sample comments] |
   | Comment diversity | [1-5] | [unique commenters] |
   | Like/comment ratio | [ratio] | [normal/abnormal] |
   | Engagement timing | [pattern] | [organic/suspicious] |
   | Follower engagement % | [%] | [good/poor] |
   
   ### Engagement Pods/Buying Signs
   
   - [ ] Sudden follower spikes
   - [ ] Engagement from unrelated accounts
   - [ ] Generic/emoji-only comments
   - [ ] Inconsistent engagement patterns
   - [ ] Follower/following ratio red flags
   
   **Authenticity Assessment**: [Authentic/Some concerns/Suspicious]
   
   ### Response & Interaction
   
   - **Responds to comments**: [Yes/Sometimes/Rarely]
   - **Community building**: [Strong/Average/Weak]
   - **Two-way engagement**: [assessment]
   
   ### Engagement Quality Score: [X/5]
   
   **Justification**: [explanation]
   
   **Weighted Score**: [X] × [weight%] = [weighted points]
   ```

6. **Score Partnership Potential**

   ```markdown
   ## Partnership Potential Score
   
   **Influencer**: @[handle]
   
   ### Partnership History
   
   | Brand | Recency | Content Quality | Disclosure | Notes |
   |-------|---------|-----------------|------------|-------|
   | [Brand 1] | [date] | [rating] | [✅/❌] | [notes] |
   | [Brand 2] | [date] | [rating] | [✅/❌] | [notes] |
   
   **Observations**:
   - Partnership frequency: [X per month]
   - Brand category mix: [categories]
   - Competitor partnerships: [details]
   
   ### Professionalism Indicators
   
   | Factor | Assessment | Evidence |
   |--------|------------|----------|
   | Contact availability | [Easy/Moderate/Difficult] | [contact info] |
   | Response reputation | [Responsive/Mixed/Unresponsive] | [if known] |
   | Content delivery | [On time/Variable/Problematic] | [if known] |
   | Creative quality in ads | [Strong/Average/Weak] | [examples] |
   | Disclosure compliance | [Always/Usually/Sometimes] | [examples] |
   
   ### Exclusivity & Availability
   
   - **Category exclusivity**: [Yes/No - details]
   - **Competitor restrictions**: [details]
   - **Upcoming availability**: [if known]
   
   ### Estimated Value
   
   | Metric | Estimate | Notes |
   |--------|----------|-------|
   | Estimated rate | [range] | Based on [followers/engagement] |
   | CPM estimate | [$X] | Industry average: [$X] |
   | Value assessment | [Good/Fair/Premium] | |
   
   ### Partnership Potential Score: [X/5]
   
   **Justification**: [explanation]
   
   **Weighted Score**: [X] × [weight%] = [weighted points]
   ```

7. **Calculate Final Score**

   ```markdown
   ## Final Fit Score
   
   **Influencer**: @[handle]
   
   ### Score Summary
   
   | Dimension | Raw Score | Weight | Weighted Score |
   |-----------|-----------|--------|----------------|
   | Audience Match | [X/5] | [%] | [points] |
   | Content Quality | [X/5] | [%] | [points] |
   | Brand Alignment | [X/5] | [%] | [points] |
   | Engagement Quality | [X/5] | [%] | [points] |
   | Partnership Potential | [X/5] | [%] | [points] |
   | **Total** | | **100%** | **[X/5.00]** |
   
   ### Score Interpretation
   
   | Score Range | Rating | Recommendation |
   |-------------|--------|----------------|
   | 4.5-5.0 | Excellent | Priority partner |
   | 4.0-4.4 | Very Good | Strong candidate |
   | 3.5-3.9 | Good | Worth pursuing |
   | 3.0-3.4 | Average | Consider with caveats |
   | 2.5-2.9 | Below Average | Proceed with caution |
   | <2.5 | Poor | Not recommended |
   
   ### Final Rating: [X/5] - [Rating]
   
   ### Recommendation
   
   **Verdict**: [Highly Recommended / Recommended / Consider / Pass]
   
   **Key Strengths**:
   1. [Strength 1]
   2. [Strength 2]
   3. [Strength 3]
   
   **Key Concerns**:
   1. [Concern 1]
   2. [Concern 2]
   
   **Best Use Case**: [what type of campaign/content]
   
   **Expected Performance**: 
   - Estimated reach: [X]
   - Estimated engagement: [X]
   - Cost estimate: [$X]
   - Projected CPE: [$X]
   ```

8. **For Multiple Influencers - Comparison**

   ```markdown
   # Influencer Comparison Report
   
   **Campaign**: [name]
   **Date**: [date]
   **Influencers Evaluated**: [count]
   
   ## Ranking Summary
   
   | Rank | Influencer | Platform | Followers | Final Score | Rating |
   |------|------------|----------|-----------|-------------|--------|
   | 1 | @[handle] | [platform] | [count] | [X/5] | ⭐⭐⭐⭐⭐ |
   | 2 | @[handle] | [platform] | [count] | [X/5] | ⭐⭐⭐⭐ |
   | 3 | @[handle] | [platform] | [count] | [X/5] | ⭐⭐⭐⭐ |
   
   ## Detailed Comparison
   
   | Dimension | @[handle1] | @[handle2] | @[handle3] |
   |-----------|------------|------------|------------|
   | Audience Match | [X/5] | [X/5] | [X/5] |
   | Content Quality | [X/5] | [X/5] | [X/5] |
   | Brand Alignment | [X/5] | [X/5] | [X/5] |
   | Engagement Quality | [X/5] | [X/5] | [X/5] |
   | Partnership Potential | [X/5] | [X/5] | [X/5] |
   | **Final Score** | **[X/5]** | **[X/5]** | **[X/5]** |
   
   ## Visual Comparison
   
   ```
   Audience Match    |████████░░| |██████░░░░| |████████░░|
   Content Quality   |██████░░░░| |████████░░| |██████░░░░|
   Brand Alignment   |████████░░| |██████░░░░| |████████░░|
   Engagement        |██████░░░░| |████████░░| |████████░░|
   Partnership       |████████░░| |██████░░░░| |██████░░░░|
                      @handle1     @handle2     @handle3
   ```
   
   ## Recommendation
   
   **For this campaign, prioritize**:
   1. **@[handle]** - [reason]
   2. **@[handle]** - [reason]
   
   **Consider combining**:
   - [Influencer A] for [purpose] + [Influencer B] for [purpose]
   
   **Pass on**:
   - @[handle]: [reason]
   ```

## Example

**User**: "Compare these 3 influencers for our sustainable fashion brand: @ecofashionista, @greenwardrobe, @sustainablesarah"

**Output**: [Detailed comparison with scores, leading to clear recommendations with @sustainablesarah ranked #1 due to highest audience match and engagement authenticity]

## Custom Weighting

Adjust weights based on campaign goals:

| Campaign Goal | Audience | Content | Brand | Engagement | Partnership |
|---------------|----------|---------|-------|------------|-------------|
| Awareness | 30% | 25% | 15% | 20% | 10% |
| Engagement | 20% | 20% | 15% | 35% | 10% |
| Conversion | 35% | 15% | 20% | 20% | 10% |
| Brand Building | 20% | 25% | 30% | 15% | 10% |
| Long-term | 25% | 20% | 25% | 15% | 15% |

## Tips for Success

1. **Be consistent** - Use same criteria for all influencers
2. **Gather data** - More data = more accurate scores
3. **Consider context** - Scores are relative to campaign needs
4. **Update regularly** - Influencer quality changes over time
5. **Trust but verify** - Spot-check high scores before outreach

## Related Skills

- [influencer-discovery](../influencer-discovery/) - Find influencers to score
- [competitor-tracker](../competitor-tracker/) - Benchmark against competitor partners
- [audience-analyzer](../../insight/audience-analyzer/) - Define target audience
- [outreach-manager](../../activate/outreach-manager/) - Contact top-scored influencers

