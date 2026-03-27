package com.example.post_service.service;

import com.example.post_service.entity.PostLike;
import com.example.post_service.exceptions.BadRequestException;
import com.example.post_service.exceptions.ResourceNotFoundException;
import com.example.post_service.repository.LikeRepository;
import com.example.post_service.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class LikeService {
    private final LikeRepository likeRepository;
    private final PostRepository postRepository;

    public void likePosts(Long postId, long userId) {
        log.info("Attempting to like the post with id: {}", postId);
        boolean exists = postRepository.existsById(postId);
        if(!exists) throw new ResourceNotFoundException("post not found with id:"+postId);

        boolean alreadyLiked = likeRepository.existsByUserIdAndPostId(userId , postId);
        if(alreadyLiked) throw new BadRequestException("post is already Liked");
        PostLike postLike = new PostLike();
        postLike.setPostId(postId);
        postLike.setUserId(userId);
        likeRepository.save(postLike);
        log.info("liked successfully");
    }

    public void unlikePost(Long postId, Long userId) {
        log.info("Attempting to unlike the post with id: {}", postId);
        boolean exists = postRepository.existsById(postId);
        if(!exists) throw new ResourceNotFoundException("Post not found with id: "+postId);

        boolean alreadyLiked = likeRepository.existsByUserIdAndPostId(userId, postId);
        if(!alreadyLiked) throw new BadRequestException("Cannot unlike the post which is not liked.");

        likeRepository.deleteByUserIdAndPostId(userId, postId);

        log.info("Post with id: {} unliked successfully", postId);
    }
}
